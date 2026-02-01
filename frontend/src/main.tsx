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
import { RootProviders } from "@/stores/providers";

import "./index.css";

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
  const LDProvider = await asyncWithLDProvider({
    clientSideID: import.meta.env.VITE_LAUNCH_DARKLY_CLIENT_SIDE_ID,
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
