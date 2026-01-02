import { Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./pages/user/UserRegister"; // Import your page

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>SKA 2026 Coming Soon!</div>} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
