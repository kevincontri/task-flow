import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => `${d.loc?.join(".")}: ${d.msg}`).join("; "));
      } else if (detail) {
        setError(detail);
      } else if (err.response) {
        setError(`Server error ${err.response.status}`);
      } else if (err.request) {
        setError("Cannot reach server. Is the backend running on :8000?");
      } else {
        setError(err.message || "Unexpected error");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="hill hill-far" />
      <div className="hill hill-mid" />
      <div className="hill hill-near" />
      <div className="hill hill-nearer" />

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
          <p className="brand-tagline">Start tracking your tasks!</p>
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
            Sign In
          </button>
        </form>

        <p className="register-prompt">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
      <footer className="login-footer">
        <p>
          Made by <a href="https://github.com/kevincontri" target="_blank" rel="noopener noreferrer">Kevin Contri</a>
        </p>
      </footer>
    </div>
  );
}
