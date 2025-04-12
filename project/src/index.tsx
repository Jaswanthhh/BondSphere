import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Desktop } from "./screens/Desktop";
import { SignUp } from "./screens/SignUp";
import { Home } from "./screens/Home";
import { Jobs } from "./screens/Jobs";
import { AuthProvider } from "./lib/auth-context";
import { ProtectedRoute } from "./components/protected-route";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Desktop />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/home/*" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate to="/home" replace />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>,
);