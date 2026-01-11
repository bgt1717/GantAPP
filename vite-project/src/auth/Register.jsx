import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API = "http://localhost:5000";

export default function Register() {
  const [name, setName] = useState("");     // ✅ REQUIRED
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,        // ✅ SEND NAME
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/projects");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Register</h2>

        <form className="register-form" onSubmit={handleRegister}>
          <input
            className="register-input"
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="register-input"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="register-input"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="register-button" type="submit">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link className="register-link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
