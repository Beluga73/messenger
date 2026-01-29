import { Navigate } from "react-router-dom";

import { useTokenStore } from "@/stores/tokenStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const refreshToken = useTokenStore((state) => state.refreshToken);

  if (!refreshToken) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};
