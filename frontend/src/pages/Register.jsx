import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 3 || username.length > 32) {
      setError("Username must be between 3 and 32 characters.");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }

    try {
      await api.post("/auth/register", { email, username, password });
      navigate("/login");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join("; "));
      } else {
        setError(detail || "Registration failed");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="hill hill-far" />
      <div className="hill hill-mid" />
      <div className="hill hill-near" />

      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path
                d="M6 16 L13 23 L26 9"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="brand-name">TaskFlow</h1>
          <p className="brand-tagline">Create your account</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-signin">
            Create Account
          </button>
        </form>

        <p className="register-prompt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      <footer className="login-footer">
        <p>
          Made by{" "}
          <a
            href="https://github.com/kevincontri"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kevin Contri
          </a>
        </p>
      </footer>
    </div>
  );
}
