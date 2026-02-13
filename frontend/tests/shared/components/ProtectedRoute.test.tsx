import { BrowserRouter } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { useTokenStore } from "@/stores/tokenStore";

// Mock react-router-dom Navigate
vi.mock("@/stores/tokenStore");

const mockUseTokenStore = vi.mocked(useTokenStore);

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when refresh token exists", () => {
    mockUseTokenStore.mockReturnValue("refresh-token" as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeTruthy();
  });

  it("navigates to register when no refresh token", () => {
    mockUseTokenStore.mockReturnValue(null as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Navigate component will redirect, so protected content should not be present
    expect(!screen.queryByText("Protected Content")).toBe(true);
  });

  it("selects refreshToken from token store state", () => {
    mockUseTokenStore.mockReturnValue("test-refresh-token" as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Verify the selector was called
    expect(mockUseTokenStore).toHaveBeenCalled();
  });

  it("handles undefined refresh token as no auth", () => {
    mockUseTokenStore.mockReturnValue(undefined as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(!screen.queryByText("Protected Content")).toBe(true);
  });

  it("renders multiple children correctly", () => {
    mockUseTokenStore.mockReturnValue("refresh-token" as any);

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>First Child</div>
          <div>Second Child</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText("First Child")).toBeTruthy();
    expect(screen.getByText("Second Child")).toBeTruthy();
  });
});
