import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/useSettings";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { settings, isLoading, updateSetting, changePassword } = useSettings();
  const { isAdmin } = useUserRole();

  // Company info state
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  // Notification state
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [dailySalesReport, setDailySalesReport] = useState(true);
  const [newUserRegistration, setNewUserRegistration] = useState(false);

  // System state
  const [reorderThreshold, setReorderThreshold] = useState("20");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Populate from DB
  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyInfo.company_name || "");
      setCompanyEmail(settings.companyInfo.email || "");
      setCompanyPhone(settings.companyInfo.phone || "");
      setCompanyAddress(settings.companyInfo.address || "");
      setLowStockAlerts(settings.notifications.low_stock_alerts ?? true);
      setDailySalesReport(settings.notifications.daily_sales_report ?? true);
      setNewUserRegistration(settings.notifications.new_user_registration ?? false);
      setReorderThreshold(String(settings.system.reorder_threshold ?? 20));
    }
  }, [settings]);

  const handleSaveCompany = () => {
    updateSetting.mutate({
      key: "company_info",
      value: {
        company_name: companyName,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
      },
    });
  };

  const handleToggleNotification = (
    field: "low_stock_alerts" | "daily_sales_report" | "new_user_registration",
    value: boolean
  ) => {
    const updated = {
      low_stock_alerts: lowStockAlerts,
      daily_sales_report: dailySalesReport,
      new_user_registration: newUserRegistration,
      [field]: value,
    };

    if (field === "low_stock_alerts") setLowStockAlerts(value);
    if (field === "daily_sales_report") setDailySalesReport(value);
    if (field === "new_user_registration") setNewUserRegistration(value);

    updateSetting.mutate({ key: "notifications", value: updated });
  };

  const handleSaveSystem = () => {
    updateSetting.mutate({
      key: "system",
      value: {
        currency: settings?.system.currency || "KES (Kenyan Shilling)",
        timezone: settings?.system.timezone || "Africa/Nairobi",
        reorder_threshold: parseInt(reorderThreshold) || 20,
      },
    });
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    changePassword.mutate(
      { newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your system preferences</p>
        </div>

        <div className="space-y-6">
          {/* Company Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              {isAdmin && (
                <Button onClick={handleSaveCompany} disabled={updateSetting.isPending}>
                  {updateSetting.isPending ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are running low
                  </p>
                </div>
                <Switch
                  checked={lowStockAlerts}
                  onCheckedChange={(v) => handleToggleNotification("low_stock_alerts", v)}
                  disabled={!isAdmin}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Sales Report</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily sales summary via email
                  </p>
                </div>
                <Switch
                  checked={dailySalesReport}
                  onCheckedChange={(v) => handleToggleNotification("daily_sales_report", v)}
                  disabled={!isAdmin}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new users are created
                  </p>
                </div>
                <Switch
                  checked={newUserRegistration}
                  onCheckedChange={(v) => handleToggleNotification("new_user_registration", v)}
                  disabled={!isAdmin}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={settings?.system.currency || "KES (Kenyan Shilling)"} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" value={settings?.system.timezone || "Africa/Nairobi"} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorder-threshold">Default Reorder Level (%)</Label>
                <Input
                  id="reorder-threshold"
                  type="number"
                  value={reorderThreshold}
                  onChange={(e) => setReorderThreshold(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
              {isAdmin && (
                <Button onClick={handleSaveSystem} disabled={updateSetting.isPending}>
                  {updateSetting.isPending ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              <Button
                onClick={handleChangePassword}
                disabled={changePassword.isPending || !newPassword}
              >
                {changePassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
