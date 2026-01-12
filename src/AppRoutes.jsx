import { Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./pages/user/UserRegister";
import LandingPage from "./pages/user/LandingPage";
import UserLogin from "./pages/user/UserLogin";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { useLogin } from "./contexts/LoginContext.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

function LoginRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "user") {
    return <Navigate to="/dashboard" replace />;
  }
  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <UserLogin />;
}

function AdminLoginRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (token && role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminLogin />;
}

function HomeRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "user") {
    return <Navigate to="/dashboard" replace />;
  }
  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <LandingPage />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/admin/login" element={<AdminLoginRoute />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
