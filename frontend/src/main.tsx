import React from "react";

import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import ReactDOM from "react-dom/client";

import CallsPage from "@/pages/CallsPage";
import ChatDetailPage from "@/pages/ChatDetailPage";
import ChatsPage from "@/pages/ChatsPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingsPage from "@/pages/SettingsPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { extractLDContext } from "@/shared/lib/launchDarkly";
import { RootProviders } from "@/stores/providers";

import "./index.css";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:id"
          element={
            <ProtectedRoute>
              <ChatDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <CallsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/chats" replace />} />
      </Routes>
    </Router>
  );
};

(async () => {
  let context: ReturnType<typeof extractLDContext>;

  const tokenStoreJSON = localStorage.getItem("token-store");
  if (tokenStoreJSON) {
    const jwtToken = JSON.parse(tokenStoreJSON).state?.jwtToken;
    if (jwtToken) {
      const ldContext = extractLDContext(jwtToken);
      if (ldContext) {
        context = ldContext;
      }
    }
  }

  const LDProvider = await asyncWithLDProvider({
    clientSideID: import.meta.env.VITE_LAUNCH_DARKLY_CLIENT_SIDE_ID,
    context,
  });
  return ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <LDProvider>
        <RootProviders>
          <App />
        </RootProviders>
      </LDProvider>
    </React.StrictMode>
  );
})();
