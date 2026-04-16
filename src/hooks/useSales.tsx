import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSales = () => {
  const queryClient = useQueryClient();

  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select(`
          *,
          sales_items(
            quantity,
            product:products(name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Batch-fetch unique clerk profiles in one query
      const clerkIds = [...new Set(data.map(s => s.clerk_id).filter(Boolean))] as string[];
      let profilesMap: Record<string, { full_name: string }> = {};

      if (clerkIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", clerkIds);

        if (profiles) {
          profilesMap = Object.fromEntries(profiles.map(p => [p.id, { full_name: p.full_name }]));
        }
      }

      return data.map(sale => ({
        ...sale,
        clerk: sale.clerk_id ? profilesMap[sale.clerk_id] || null : null,
      }));
    },
  });

  const createSale = useMutation({
    mutationFn: async ({ sale, items }: { sale: any; items: any[] }) => {
      // Create sale
      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert(sale)
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const itemsWithSaleId = items.map(item => ({
        ...item,
        sale_id: saleData.id,
      }));

      const { error: itemsError } = await supabase
        .from("sales_items")
        .insert(itemsWithSaleId);

      if (itemsError) throw itemsError;

      // Stock is automatically decremented by the database trigger (decrement_stock_on_sale)

      return saleData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Sale created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create sale: " + error.message);
    },
  });

  return {
    sales,
    isLoading,
    createSale,
  };
};
