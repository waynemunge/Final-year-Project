import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "@/pages/Auth";
import { TestWrapper } from "@/test/mocks";

// Override useAuth for Auth page tests
const mockSignIn = vi.fn().mockResolvedValue({ error: null });
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    session: null,
    signIn: mockSignIn,
    signUp: vi.fn(),
    signOut: vi.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Auth Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form with email and password fields", () => {
    render(<Auth />, { wrapper: TestWrapper });

    expect(screen.getByText("GizmoKe")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays the app description", () => {
    render(<Auth />, { wrapper: TestWrapper });
    expect(screen.getByText("Inventory & Sales Management System")).toBeInTheDocument();
  });

  it("shows contact admin message instead of signup", () => {
    render(<Auth />, { wrapper: TestWrapper });
    expect(screen.getByText(/contact your administrator/i)).toBeInTheDocument();
  });

  it("allows typing in email and password fields", () => {
    render(<Auth />, { wrapper: TestWrapper });

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "admin@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("admin@test.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls signIn on form submission", async () => {
    render(<Auth />, { wrapper: TestWrapper });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("admin@test.com", "password123");
    });
  });

  it("has required attribute on email and password fields", () => {
    render(<Auth />, { wrapper: TestWrapper });

    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Password")).toBeRequired();
  });
});
