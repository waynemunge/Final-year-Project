import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompanyInfo {
  company_name: string;
  email: string;
  phone: string;
  address: string;
}

interface NotificationSettings {
  low_stock_alerts: boolean;
  daily_sales_report: boolean;
  new_user_registration: boolean;
}

interface SystemSettings {
  currency: string;
  timezone: string;
  reorder_threshold: number;
}

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value");

      if (error) throw error;

      const map: Record<string, any> = {};
      data?.forEach((row: any) => {
        map[row.key] = row.value;
      });

      return {
        companyInfo: (map.company_info || {}) as CompanyInfo,
        notifications: (map.notifications || {}) as NotificationSettings,
        system: (map.system || {}) as SystemSettings,
      };
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to save settings: " + error.message);
    },
  });

  const changePassword = useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update password: " + error.message);
    },
  });

  return {
    settings,
    isLoading,
    updateSetting,
    changePassword,
  };
};
