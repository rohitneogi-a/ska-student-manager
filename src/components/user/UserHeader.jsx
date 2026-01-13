import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' // <-- add useLocation
import { GraduationCap, Menu, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

// Menu items data
const menuItems = [
  ["DashBoard", "/dashboard"],
  ["Profile", "/profile"],
  ["Settings", "/settings"],
  ["Payments", "/payments"],
]

function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation() // <-- get current location

  const handleLogout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("Role")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  return (
    <header className="font-header-navbar fixed top-0 w-full z-50 bg-linear-to-br from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/30 shadow-lg shadow-black/5">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between text-slate-800">

        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white gradient-accent shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">SKA Manager</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map(([label, path]) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={
                `transition cursor-pointer px-4 py-2 rounded-2xl font-semibold flex items-center gap-2
                ${location.pathname === path
                  ? "bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/50 hover:scale-105 text-cyan-700"
                  : "hover:text-cyan-500"}`
              }
            >
              {label}
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              px-4 py-2 rounded-2xl font-semibold
              flex items-center gap-2
              bg-white/30 backdrop-blur-md
              border border-white/40
              hover:bg-white/50 hover:scale-105
              transition cursor-pointer
            "
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/30 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="
            md:hidden absolute top-full left-0 w-full z-50
            bg-linear-to-br from-teal-900/90 via-cyan-900/90 to-teal-900/90
            backdrop-blur-xl backdrop-saturate-150
            border-t border-white/20
            shadow-xl
          "
        >
          <div className="flex flex-col space-y-2 p-4 text-white">
            {menuItems.map(([label, path]) => (
              <button
                key={label}
                onClick={() => {
                  navigate(path)
                  setMobileMenuOpen(false)
                }}
                className={
                  `py-2 px-3 rounded-lg transition text-left
                  ${location.pathname === path
                    ? "bg-white/30 backdrop-blur-md border border-white/40 text-cyan-200"
                    : "hover:bg-white/15"}`
                }
              >
                {label}
              </button>
            ))}

            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              className="
                py-2 px-3 rounded-lg
                bg-linear-to-br from-teal-500 to-cyan-500
                text-white font-semibold shadow-md
              "
            >
              Logout
            </button>
          </div>
        </div>
      )}

    </header>
  )
}

export default UserHeader
