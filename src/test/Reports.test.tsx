import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper, mockUserRole } from "@/test/mocks";

// Mock recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          {
            id: "s1",
            total_amount: 5000,
            created_at: new Date().toISOString(),
            sales_items: [{ quantity: 2, unit_price: 2500, subtotal: 5000, product_id: "p1" }],
          },
        ],
        error: null,
      }),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: "test" } } } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
    removeChannel: vi.fn(),
  },
}));

const { default: Reports } = await import("@/pages/Reports");

describe("Reports Page", () => {
  it("renders reports page header", () => {
    render(<Reports />, { wrapper: TestWrapper });
    expect(screen.getByText("Reports & Analytics")).toBeInTheDocument();
    expect(screen.getByText("View detailed business insights")).toBeInTheDocument();
  });

  it("has period selector", () => {
    render(<Reports />, { wrapper: TestWrapper });
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("has export PDF button", () => {
    render(<Reports />, { wrapper: TestWrapper });
    expect(screen.getByText("Export PDF")).toBeInTheDocument();
  });

  it("displays stat card labels", () => {
    render(<Reports />, { wrapper: TestWrapper });
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Total Profit")).toBeInTheDocument();
    expect(screen.getByText("Profit Margin")).toBeInTheDocument();
  });

  it("shows top selling products section", () => {
    render(<Reports />, { wrapper: TestWrapper });
    expect(screen.getByText("Top Selling Products")).toBeInTheDocument();
  });
});
