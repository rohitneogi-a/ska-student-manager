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
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import StudentMasterData from "./pages/admin/StudentMasterData.jsx";
import ModeratorDetails from "./pages/admin/ModeratorDetails.jsx";
import ModeratorLogin from "./pages/moderator/ModeratorLogin.jsx";
import ModeratorDashboard from "./pages/moderator/ModeratorDashboard.jsx";
import ModeratorUsers from "./pages/moderator/ModeratorUsers.jsx";
import ModeratorProfile from "./pages/moderator/ModeratorProfile.jsx";

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
function ModeratorLoginRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "moderator") return <Navigate to="/moderator/dashboard" replace />;
  if (token && role === "user") return <Navigate to="/dashboard" replace />;
  return <ModeratorLogin />;
}

function HomeRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "user") return <Navigate to="/dashboard" replace />;
  if (token && role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (token && role === "moderator") return <Navigate to="/moderator/dashboard" replace />;
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
      <Route path="/moderator/login" element={<ModeratorLoginRoute />} />
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
      <Route
        path="/admin/moderators/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ModeratorDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
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
      <Route
        path="/admin/student-master-data"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StudentMasterData />
          </ProtectedRoute>
        }
      />

      {/* Moderator Protected Routes */}

      <Route
        path="/moderator/dashboard"
        element={
          <ProtectedRoute allowedRoles={["moderator"]}>
            <ModeratorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/moderator/users"
        element={
          <ProtectedRoute allowedRoles={["moderator"]}>
            <ModeratorUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/moderator/profile"
        element={
          <ProtectedRoute allowedRoles={["moderator"]}>
            <ModeratorProfile />
          </ProtectedRoute>
        }
      />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
