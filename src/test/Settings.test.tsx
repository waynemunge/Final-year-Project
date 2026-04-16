import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestWrapper, mockUserRole } from "@/test/mocks";

vi.mock("@/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: {
      companyInfo: {
        company_name: "GizmoKe Ltd",
        email: "info@gizmoke.com",
        phone: "+254700000000",
        address: "Nairobi, Kenya",
      },
      notifications: {
        low_stock_alerts: true,
        daily_sales_report: false,
        new_user_registration: true,
      },
      system: {
        currency: "KES (Kenyan Shilling)",
        timezone: "Africa/Nairobi",
        reorder_threshold: 20,
      },
    },
    isLoading: false,
    updateSetting: { mutate: vi.fn(), isPending: false },
    changePassword: { mutate: vi.fn(), isPending: false },
  }),
}));

const { default: Settings } = await import("@/pages/Settings");

describe("Settings Page", () => {
  it("renders settings page heading", () => {
    render(<Settings />, { wrapper: TestWrapper });
    const headings = screen.getAllByText("Settings");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("displays company information section", () => {
    render(<Settings />, { wrapper: TestWrapper });
    expect(screen.getByText("Company Information")).toBeInTheDocument();
    expect(screen.getByDisplayValue("GizmoKe Ltd")).toBeInTheDocument();
    expect(screen.getByDisplayValue("info@gizmoke.com")).toBeInTheDocument();
  });

  it("displays notifications section", () => {
    render(<Settings />, { wrapper: TestWrapper });
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Low Stock Alerts")).toBeInTheDocument();
    expect(screen.getByText("Daily Sales Report")).toBeInTheDocument();
    expect(screen.getByText("New User Registration")).toBeInTheDocument();
  });

  it("displays system settings section", () => {
    render(<Settings />, { wrapper: TestWrapper });
    expect(screen.getByText("System Settings")).toBeInTheDocument();
    expect(screen.getByDisplayValue("KES (Kenyan Shilling)")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
  });

  it("displays security section", () => {
    render(<Settings />, { wrapper: TestWrapper });
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Update Password")).toBeInTheDocument();
  });

  it("shows save buttons for admin", () => {
    render(<Settings />, { wrapper: TestWrapper });
    const saveButtons = screen.getAllByText("Save Changes");
    expect(saveButtons.length).toBeGreaterThanOrEqual(2);
  });
});
