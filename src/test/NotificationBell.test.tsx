import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestWrapper } from "@/test/mocks";
import { NotificationBell } from "@/components/NotificationBell";

vi.mock("@/hooks/useNotifications", () => ({
  useNotifications: () => ({
    notifications: [
      {
        id: "n1",
        user_id: "test-user-id",
        title: "Low Stock Alert",
        message: "Widget A has only 3 units left",
        type: "low_stock",
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "n2",
        user_id: "test-user-id",
        title: "New User Registered",
        message: "John Doe joined the system",
        type: "new_user",
        is_read: true,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    unreadCount: 1,
    isLoading: false,
    markAsRead: { mutate: vi.fn() },
    markAllAsRead: { mutate: vi.fn() },
  }),
}));

describe("NotificationBell", () => {
  it("renders bell icon", () => {
    render(<NotificationBell />, { wrapper: TestWrapper });
    // The button should exist
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows unread count badge", () => {
    render(<NotificationBell />, { wrapper: TestWrapper });
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
