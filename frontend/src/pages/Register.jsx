import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

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
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}> {error} </p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already registered? Click <Link to="/login">here</Link> to Login
      </p>
    </div>
  );
}
