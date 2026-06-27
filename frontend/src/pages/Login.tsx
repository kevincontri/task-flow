import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { Link } from "react-router-dom";
// @ts-ignore
import "./Login.css";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import DevAlert from "../components/DevAlert.tsx";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { login } = useAuth() as { login: (email: string, password: string) => Promise<void> };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setShowAlert(true);
    try {
      await login(email, password);
    } catch (err: any) {
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
    setShowAlert(false);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <DevAlert language={language} setShowAlert={setShowAlert} showAlert={showAlert}/>
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
          <p className="brand-tagline">
            {language === "en"
              ? "Start tracking your tasks!"
              : "Comece a rastrear suas tarefas!"}
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
            {language === "en" ? "Sign In" : "Entrar"}
          </button>
        </form>

        <p className="register-prompt">
          {language === "en" ? "Don't have an account?" : "Não tem uma conta?"}{" "}
          <Link to="/register">
            {language === "en" ? "Create one" : "Crie uma"}
          </Link>
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
          {language === "en" ? "Made by" : "Feito por"}{" "}
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
