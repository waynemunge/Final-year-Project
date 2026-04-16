import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper, mockSupabase } from "@/test/mocks";

vi.mock("@/hooks/useDashboard", () => ({
  useDashboard: () => ({
    stats: {
      totalProducts: 150,
      totalSales: 45,
      totalRevenue: 250000,
      totalProfit: 75000,
    },
    lowStockItems: [
      { name: "Widget A", quantity: 3, reorder_level: 10 },
      { name: "Widget B", quantity: 5, reorder_level: 15 },
    ],
    salesTrend: [
      { month: "Jan", sales: 10, revenue: 50000 },
      { month: "Feb", sales: 15, revenue: 75000 },
    ],
    isLoading: false,
  }),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

const { default: Dashboard } = await import("@/pages/Dashboard");

describe("Dashboard Page", () => {
  it("renders the dashboard heading", () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    const headings = screen.getAllByText("Dashboard");
    // At least the h1 heading
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("shows welcome message", () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("displays stat cards with correct values", () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("KES 250,000")).toBeInTheDocument();
    expect(screen.getByText("KES 75,000")).toBeInTheDocument();
  });

  it("displays stat card labels", () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    expect(screen.getByText("Total Products")).toBeInTheDocument();
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Profit")).toBeInTheDocument();
  });

  it("displays low stock alerts", () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    expect(screen.getByText("Low Stock Alert")).toBeInTheDocument();
    expect(screen.getByText("Widget A")).toBeInTheDocument();
    expect(screen.getByText("Widget B")).toBeInTheDocument();
  });

  it("shows stock details for low stock items", () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    expect(screen.getByText(/Current: 3/)).toBeInTheDocument();
    expect(screen.getByText(/Reorder Level: 10/)).toBeInTheDocument();
  });
});
