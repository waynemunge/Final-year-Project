import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Building2,
  Settings,
  LogOut,
  Tags,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationBell } from "@/components/NotificationBell";

interface LayoutProps {
  children: ReactNode;
}

type Role = "admin" | "manager" | "cashier";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  allowedRoles: Role[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", allowedRoles: ["admin", "manager", "cashier"] },
  { icon: Package, label: "Products", path: "/products", allowedRoles: ["admin", "manager"] },
  { icon: Tags, label: "Categories", path: "/categories", allowedRoles: ["admin", "manager"] },
  { icon: ShoppingCart, label: "Sales", path: "/sales", allowedRoles: ["admin", "manager", "cashier"] },
  { icon: FileText, label: "Reports", path: "/reports", allowedRoles: ["admin", "manager"] },
  { icon: Users, label: "Users", path: "/users", allowedRoles: ["admin"] },
  { icon: Building2, label: "Suppliers", path: "/suppliers", allowedRoles: ["admin", "manager"] },
  { icon: Settings, label: "Settings", path: "/settings", allowedRoles: ["admin"] },
];

const NavContent = ({ onNavigate, role }: { onNavigate?: () => void; role: Role | null }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  const filteredNavItems = navItems.filter(
    (item) => role && item.allowedRoles.includes(role)
  );

  return (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">GizmoKe</h1>
        <p className="text-sm text-sidebar-foreground/70">Inventory System</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} onClick={onNavigate}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <NavContent role={role} />
      </aside>

      {/* Mobile Header + Sheet */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <div>
            <h1 className="text-xl font-bold text-primary">GizmoKe</h1>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-sidebar">
              <div className="flex flex-col h-full">
                <NavContent role={role} onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Desktop notification bar */}
        <div className="hidden md:flex items-center justify-end px-6 py-2 border-b border-border bg-background">
          <NotificationBell />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
