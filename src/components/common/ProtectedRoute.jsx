import { Navigate } from "react-router-dom";
import { useLogin } from "../../contexts/LoginContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");
  const storedRole = localStorage.getItem("Role"); // Get role from localStorage

  // Use stored role as fallback if context role isn't available yet
  const effectiveRole = role || storedRole;

  if (!token || !effectiveRole || !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}