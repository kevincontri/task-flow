import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { JSX } from "react/jsx-runtime";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth() as { token: string };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
