import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TestWrapper } from "@/test/mocks";

vi.mock("@/hooks/useProducts", () => ({
  useProducts: () => ({
    products: [
      {
        id: "p1",
        sku: "SKU001",
        name: "Test Product",
        quantity: 50,
        reorder_level: 10,
        cost_price: 500,
        selling_price: 750,
        category: { name: "Electronics" },
        supplier: { company_name: "Supplier A" },
      },
      {
        id: "p2",
        sku: "SKU002",
        name: "Low Stock Item",
        quantity: 3,
        reorder_level: 10,
        cost_price: 200,
        selling_price: 350,
        category: { name: "Accessories" },
        supplier: { company_name: "Supplier B" },
      },
      {
        id: "p3",
        sku: "SKU003",
        name: "Out of Stock Item",
        quantity: 0,
        reorder_level: 5,
        cost_price: 100,
        selling_price: 200,
        category: null,
        supplier: null,
      },
    ],
    isLoading: false,
    createProduct: { mutate: vi.fn(), isPending: false },
    addProduct: { mutate: vi.fn(), isPending: false },
    updateProduct: { mutate: vi.fn(), isPending: false },
    deleteProduct: { mutate: vi.fn(), isPending: false },
  }),
}));

vi.mock("@/hooks/useCategories", () => ({
  useCategories: () => ({
    categories: [{ id: "c1", name: "Electronics" }],
    isLoading: false,
    createCategory: { mutate: vi.fn(), isPending: false },
    updateCategory: { mutate: vi.fn(), isPending: false },
    deleteCategory: { mutate: vi.fn(), isPending: false },
  }),
}));

vi.mock("@/hooks/useSuppliers", () => ({
  useSuppliers: () => ({
    suppliers: [{ id: "s1", company_name: "Supplier A" }],
    isLoading: false,
    createSupplier: { mutate: vi.fn(), isPending: false },
    updateSupplier: { mutate: vi.fn(), isPending: false },
    deleteSupplier: { mutate: vi.fn(), isPending: false },
  }),
}));

const { default: Products } = await import("@/pages/Products");

describe("Products Page", () => {
  it("renders products page heading", () => {
    render(<Products />, { wrapper: TestWrapper });
    const headings = screen.getAllByText("Products");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("displays product table with data", () => {
    render(<Products />, { wrapper: TestWrapper });
    expect(screen.getByText("SKU001")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("shows correct stock status badges", () => {
    render(<Products />, { wrapper: TestWrapper });
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getByText("Low Stock")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("displays N/A for null category and supplier", () => {
    render(<Products />, { wrapper: TestWrapper });
    const naCells = screen.getAllByText("N/A");
    expect(naCells.length).toBeGreaterThanOrEqual(2);
  });

  it("filters products by search query", () => {
    render(<Products />, { wrapper: TestWrapper });
    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "Low Stock" } });
    expect(screen.getByText("Low Stock Item")).toBeInTheDocument();
    expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
  });

  it("shows empty state when search has no results", () => {
    render(<Products />, { wrapper: TestWrapper });
    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("displays formatted prices with KES prefix", () => {
    render(<Products />, { wrapper: TestWrapper });
    expect(screen.getByText("KES 500")).toBeInTheDocument();
    expect(screen.getByText("KES 750")).toBeInTheDocument();
  });

  it("shows table column headers", () => {
    render(<Products />, { wrapper: TestWrapper });
    expect(screen.getByText("SKU")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Cost Price")).toBeInTheDocument();
    expect(screen.getByText("Selling Price")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
