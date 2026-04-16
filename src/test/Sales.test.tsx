import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper } from "@/test/mocks";

vi.mock("@/hooks/useSales", () => ({
  useSales: () => ({
    sales: [
      {
        id: "s1",
        invoice_no: "INV-001",
        created_at: "2025-06-15T10:00:00Z",
        total_amount: 5000,
        payment_method: "Cash",
        clerk: { full_name: "John Doe" },
        sales_items: [{ id: "si1" }, { id: "si2" }],
      },
      {
        id: "s2",
        invoice_no: "INV-002",
        created_at: "2025-06-16T14:30:00Z",
        total_amount: 12500,
        payment_method: "Paystack",
        clerk: { full_name: "Jane Smith" },
        sales_items: [{ id: "si3" }],
      },
    ],
    isLoading: false,
    createSale: { mutate: vi.fn(), isPending: false },
  }),
}));

vi.mock("@/hooks/usePaystackVerification", () => ({
  usePaystackVerification: () => ({ isVerifying: false }),
}));

const { default: Sales } = await import("@/pages/Sales");

describe("Sales Page", () => {
  it("renders sales page heading", () => {
    render(<Sales />, { wrapper: TestWrapper });
    const headings = screen.getAllByText("Sales");
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Record and manage sales/i)).toBeInTheDocument();
  });

  it("displays sales data in table", () => {
    render(<Sales />, { wrapper: TestWrapper });
    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("INV-002")).toBeInTheDocument();
  });

  it("displays payment methods with badges", () => {
    render(<Sales />, { wrapper: TestWrapper });
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("Paystack")).toBeInTheDocument();
  });

  it("shows formatted amounts", () => {
    render(<Sales />, { wrapper: TestWrapper });
    expect(screen.getByText("KES 5,000")).toBeInTheDocument();
    expect(screen.getByText("KES 12,500")).toBeInTheDocument();
  });

  it("displays clerk names", () => {
    render(<Sales />, { wrapper: TestWrapper });
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("shows items count", () => {
    render(<Sales />, { wrapper: TestWrapper });
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("displays table headers", () => {
    render(<Sales />, { wrapper: TestWrapper });
    expect(screen.getByText("Invoice No.")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
    expect(screen.getByText("Payment Method")).toBeInTheDocument();
    expect(screen.getByText("Clerk")).toBeInTheDocument();
  });
});
