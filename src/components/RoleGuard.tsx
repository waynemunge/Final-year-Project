import { ReactNode } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Role = "admin" | "manager" | "cashier";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
