import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper, mockUserRole } from "@/test/mocks";

vi.mock("@/hooks/useCategories", () => ({
  useCategories: () => ({
    categories: [
      { id: "c1", name: "Electronics", description: "Electronic gadgets", created_at: "2025-01-10T08:00:00Z" },
      { id: "c2", name: "Accessories", description: null, created_at: "2025-02-15T10:00:00Z" },
    ],
    isLoading: false,
    createCategory: { mutate: vi.fn(), isPending: false },
    updateCategory: { mutate: vi.fn(), isPending: false },
    deleteCategory: { mutate: vi.fn(), isPending: false },
  }),
}));

const { default: Categories } = await import("@/pages/Categories");

describe("Categories Page", () => {
  it("renders categories page heading", () => {
    render(<Categories />, { wrapper: TestWrapper });
    const headings = screen.getAllByText("Categories");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("displays categories in table", () => {
    render(<Categories />, { wrapper: TestWrapper });
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Electronic gadgets")).toBeInTheDocument();
    expect(screen.getByText("Accessories")).toBeInTheDocument();
  });

  it("shows dash for null description", () => {
    render(<Categories />, { wrapper: TestWrapper });
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("has Add Category button for admin", () => {
    render(<Categories />, { wrapper: TestWrapper });
    expect(screen.getByText("Add Category")).toBeInTheDocument();
  });

  it("shows access denied for cashier role", () => {
    const orig = { ...mockUserRole };
    mockUserRole.role = "cashier";
    mockUserRole.isAdmin = false;
    mockUserRole.isManager = false;
    mockUserRole.isCashier = true;

    render(<Categories />, { wrapper: TestWrapper });
    expect(screen.getByText("Access Denied")).toBeInTheDocument();

    Object.assign(mockUserRole, orig);
  });

  it("displays table headers", () => {
    render(<Categories />, { wrapper: TestWrapper });
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
