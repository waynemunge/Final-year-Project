import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper, mockUserRole } from "@/test/mocks";
import { Layout } from "@/components/Layout";

describe("Layout Component", () => {
  it("renders children content", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
      { wrapper: TestWrapper }
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders app name in sidebar", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
      { wrapper: TestWrapper }
    );
    // Should have GizmoKe text (desktop + mobile)
    const gizmoTexts = screen.getAllByText("GizmoKe");
    expect(gizmoTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders navigation items for admin", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
      { wrapper: TestWrapper }
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Suppliers")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders logout button", () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
      { wrapper: TestWrapper }
    );
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("filters nav items for cashier role", () => {
    const orig = { ...mockUserRole };
    mockUserRole.role = "cashier";
    mockUserRole.isAdmin = false;
    mockUserRole.isCashier = true;

    render(
      <Layout>
        <div>Content</div>
      </Layout>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    // Should not show admin-only pages
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();

    Object.assign(mockUserRole, orig);
  });
});
