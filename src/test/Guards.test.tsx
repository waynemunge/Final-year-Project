import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper, mockUserRole } from "@/test/mocks";

// RoleGuard uses useUserRole which uses useAuth — both are mocked in mocks.tsx

describe("RoleGuard", () => {
  it("renders children when user has correct role (admin)", async () => {
    const { RoleGuard } = await import("@/components/RoleGuard");
    render(
      <RoleGuard allowedRoles={["admin"]}>
        <div>Admin Content</div>
      </RoleGuard>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("shows access denied for unauthorized role", async () => {
    const orig = { ...mockUserRole };
    mockUserRole.role = "cashier";
    mockUserRole.isAdmin = false;
    mockUserRole.isCashier = true;

    const { RoleGuard } = await import("@/components/RoleGuard");
    render(
      <RoleGuard allowedRoles={["admin"]}>
        <div>Admin Content</div>
      </RoleGuard>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();

    Object.assign(mockUserRole, orig);
  });

  it("allows multiple roles", async () => {
    const orig = { ...mockUserRole };
    mockUserRole.role = "manager";
    mockUserRole.isManager = true;
    mockUserRole.isAdmin = false;

    const { RoleGuard } = await import("@/components/RoleGuard");
    render(
      <RoleGuard allowedRoles={["admin", "manager"]}>
        <div>Manager Content</div>
      </RoleGuard>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Manager Content")).toBeInTheDocument();

    Object.assign(mockUserRole, orig);
  });
});

describe("ProtectedRoute", () => {
  it("renders children when user is authenticated", async () => {
    const { ProtectedRoute } = await import("@/components/ProtectedRoute");
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
