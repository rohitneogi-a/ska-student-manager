import { Navigate } from "react-router-dom";
import { useLogin } from "../../contexts/LoginContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");
  const storedRole = localStorage.getItem("Role");

  // Normalize roles to lowercase for comparison
  const effectiveRole = (role || storedRole || "").toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  if (!token || !effectiveRole || !normalizedAllowedRoles.includes(effectiveRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}