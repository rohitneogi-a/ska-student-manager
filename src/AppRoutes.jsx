import { Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./pages/user/UserRegister";
import LandingPage from "./pages/user/LandingPage";
import UserLogin from "./pages/user/UserLogin";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { useLogin } from "./contexts/LoginContext.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";

function LoginRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return <UserLogin />;
}

function HomeRoute() {
  const { role } = useLogin();
  const token = localStorage.getItem("Token");

  if (token && role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<LoginRoute />} />
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
