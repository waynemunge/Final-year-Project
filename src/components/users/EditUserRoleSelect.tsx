import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Shield } from "lucide-react";

interface EditUserRoleSelectProps {
  userId: string;
  currentRole?: string;
}

export function EditUserRoleSelect({ userId, currentRole }: EditUserRoleSelectProps) {
  const { updateUserRole } = useUserManagement();

  const handleRoleChange = (newRole: string) => {
    if (newRole !== currentRole) {
      updateUserRole.mutate({ userId, role: newRole });
    }
  };

  return (
    <Select value={currentRole || ""} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select role">
          {currentRole && (
            <span className="flex items-center gap-1">
              {currentRole === "admin" && <Shield className="h-3 w-3" />}
              {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        </SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="cashier">Cashier</SelectItem>
      </SelectContent>
    </Select>
  );
}
