import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
// @ts-ignore
import "./Login.css";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import { RegisterRequest } from "../types/auth_types";
import DevAlert from "../components/DevAlert.tsx";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (username.length < 3 || username.length > 32) {
      setError(
        language === "en"
          ? "Username must be between 3 and 32 characters."
          : "O nome de usuário deve ter entre 3 e 32 caracteres.",
      );
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError(
        language === "en"
          ? "Password must be between 8 and 128 characters."
          : "A senha deve ter entre 8 e 128 caracteres.",
      );
      return;
    }

    try {
      setShowAlert(true);
      setLoading(true);
      const payload: RegisterRequest = { email, username, password };
      await api.post("/auth/register", payload);
      navigate("/login");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join("; "));
      } else {
        setError(
          detail ||
            `${language === "en" ? "Registration failed" : "Falha no registro"}: ${err.response?.status || err.message}`,
        );
      }
    } finally {
      setShowAlert(false);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      { showAlert && (
        <DevAlert language={language} setShowAlert={setShowAlert} />
      )}
      <div className="hill hill-far" />
      <div className="hill hill-mid" />
      <div className="hill hill-near" />

      <div className={`login-card ${loading ? "margin-top" : ""}`}>
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
          <p className="brand-tagline">
            {language === "en" ? "Create your account" : "Crie sua conta"}
          </p>
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
            <label htmlFor="username">
              {language === "en" ? "Username" : "Nome de usuário"}
            </label>
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
            <label htmlFor="password">
              {language === "en" ? "Password" : "Senha"}
            </label>
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
            {language === "en" ? "Create Account" : "Criar Conta"}
          </button>
        </form>

        <p className="register-prompt">
          {language === "en" ? "Already have an account?" : "Já tem uma conta?"}{" "}
          <Link to="/login">{language === "en" ? "Sign in" : "Entrar"}</Link>
        </p>
      </div>
      {loading && (
        <div className="login-loading">
          <div className="login-loading-dot" />
          <div className="login-loading-dot" />
          <div className="login-loading-dot" />
        </div>
      )}
      <footer className="login-footer">
        <p>
          {language === "en" ? "Created by" : "Criado por"}{" "}
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
