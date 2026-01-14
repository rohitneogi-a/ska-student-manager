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
import UserPayments from "./pages/user/UserPayments.jsx";
import ManageModerators from "./pages/admin/ManageModerators.jsx";

// --- Route Guards ---
function LoginRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "user") return <Navigate to="/dashboard" replace />;
  if (token && role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <UserLogin />;
}

function AdminLoginRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (token && role === "user") return <Navigate to="/dashboard" replace />;
  return <AdminLogin />;
}

function HomeRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "user") return <Navigate to="/dashboard" replace />;
  if (token && role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <LandingPage />;
}

// --- Main App Routes ---
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/admin/login" element={<AdminLoginRoute />} />

      {/* User Protected Routes */}
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
        path="/payments"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserPayments />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/moderators"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageModerators />
          </ProtectedRoute>
        }
      />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
