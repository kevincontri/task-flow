import { createContext, useState, useContext, JSX } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// @ts-ignore
const AuthContext = createContext();

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Navigation hook to programmatically navigate after login/logout
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post("/auth/login", { email, password });

    const newToken = response.data.access_token;

    localStorage.setItem("token", newToken);

    setToken(newToken);

    navigate("/dashboard");
  };

  const logout = (): void => {
    localStorage.removeItem("token");

    setToken(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
