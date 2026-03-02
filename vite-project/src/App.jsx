import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Projects from "./pages/Projects";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isDemo, setIsDemo] = useState(
    () => localStorage.getItem("isDemo") === "true"
  );

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("token", newToken);

    if (newToken === "demo-user") {
      localStorage.setItem("isDemo", "true");
      setIsDemo(true);
    } else {
      localStorage.removeItem("isDemo");
      setIsDemo(false);
    }

    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isDemo");
    setToken(null);
    setIsDemo(false);
  };

  return (
    <BrowserRouter>
      {token && (
        <div style={{ padding: "10px", textAlign: "right" }}>
          {isDemo && (
            <span style={{ marginRight: "15px", fontWeight: "bold" }}>
              Demo Mode
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: "#e53935",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
            
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            !token ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/projects" />
            )
          }
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/projects" />}
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects token={token} isDemo={isDemo} />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={token ? "/projects" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;