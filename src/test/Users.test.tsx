import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper } from "@/test/mocks";

vi.mock("@/hooks/useUserManagement", () => ({
  useUserManagement: () => ({
    users: [
      {
        id: "u1",
        full_name: "Admin User",
        email: "admin@test.com",
        created_at: "2025-01-15T10:00:00Z",
        user_roles: [{ role: "admin" }],
      },
      {
        id: "u2",
        full_name: "Cashier User",
        email: "cashier@test.com",
        created_at: "2025-03-20T08:00:00Z",
        user_roles: [{ role: "cashier" }],
      },
    ],
    isLoading: false,
    deleteUser: { mutate: vi.fn(), isPending: false },
    updateUserRole: { mutate: vi.fn(), isPending: false },
  }),
}));

const { default: Users } = await import("@/pages/Users");

describe("Users Page", () => {
  it("renders users page heading", () => {
    render(<Users />, { wrapper: TestWrapper });
    const headings = screen.getAllByText("User Management");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("displays user data in table", () => {
    render(<Users />, { wrapper: TestWrapper });
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("admin@test.com")).toBeInTheDocument();
    expect(screen.getByText("Cashier User")).toBeInTheDocument();
    expect(screen.getByText("cashier@test.com")).toBeInTheDocument();
  });

  it("shows Active status badges", () => {
    render(<Users />, { wrapper: TestWrapper });
    const activeBadges = screen.getAllByText("Active");
    expect(activeBadges.length).toBe(2);
  });

  it("has Add User button", () => {
    render(<Users />, { wrapper: TestWrapper });
    expect(screen.getByText("Add User")).toBeInTheDocument();
  });
});
