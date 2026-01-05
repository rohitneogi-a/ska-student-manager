import { Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./pages/user/UserRegister"; // Import your page
import LandingPage from "./pages/user/LandingPage";
import UserLogin from "./pages/user/UserLogin";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
