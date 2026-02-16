import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

interface Props {
  children: ReactNode;
  roleRequired?: "user" | "admin";
}

export default function ProtectedRoute({ children, roleRequired }: Props) {
  const { role } = useAuthStore();

  if (!role) return <Navigate to="/login" replace />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/" replace />;

  return <>{children}</>;
}
