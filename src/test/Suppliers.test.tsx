import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper } from "@/test/mocks";

vi.mock("@/hooks/useSuppliers", () => ({
  useSuppliers: () => ({
    suppliers: [
      {
        id: "sup1",
        company_name: "Tech Corp",
        contact_person: "Alice Johnson",
        phone: "+254700111222",
        email: "alice@techcorp.com",
        address: "123 Main St",
        products_supplied: "15",
      },
      {
        id: "sup2",
        company_name: "Parts Ltd",
        contact_person: "Bob Smith",
        phone: "+254700333444",
        email: "bob@partsltd.com",
        address: null,
        products_supplied: null,
      },
    ],
    isLoading: false,
    createSupplier: { mutate: vi.fn(), isPending: false },
    addSupplier: { mutate: vi.fn(), isPending: false },
    updateSupplier: { mutate: vi.fn(), isPending: false },
    deleteSupplier: { mutate: vi.fn(), isPending: false },
  }),
}));

const { default: Suppliers } = await import("@/pages/Suppliers");

describe("Suppliers Page", () => {
  it("renders suppliers page heading", () => {
    render(<Suppliers />, { wrapper: TestWrapper });
    const headings = screen.getAllByText("Suppliers");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("displays supplier data", () => {
    render(<Suppliers />, { wrapper: TestWrapper });
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Parts Ltd")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  });

  it("shows N/A for null address", () => {
    render(<Suppliers />, { wrapper: TestWrapper });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("shows 0 for null products_supplied", () => {
    render(<Suppliers />, { wrapper: TestWrapper });
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("displays table headers", () => {
    render(<Suppliers />, { wrapper: TestWrapper });
    expect(screen.getByText("Company Name")).toBeInTheDocument();
    expect(screen.getByText("Contact Person")).toBeInTheDocument();
  });
});
