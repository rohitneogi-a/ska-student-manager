import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, LogOut, X } from 'lucide-react'
import toast from 'react-hot-toast'

const menuItems = [
  ["DashBoard", "/dashboard"],
  ["Profile", "/profile"],
  ["Payments", "/payments"],
]

function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("Role")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  /* Close menu on screen resize */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header className=" font-header-navbar fixed top-0 w-full z-50 bg-linear-to-br from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70 backdrop-blur-xl border-b border-white/30 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-accent text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-800">
            SKA Manager
          </span>
        </div>

        {/* Desktop / Large Tablet Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {menuItems.map(([label, path]) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`px-4 py-2 rounded-xl font-semibold transition
                ${location.pathname === path
                  ? "bg-white/40 text-cyan-700 border border-white/40"
                  : "hover:text-cyan-500"}
              `}
            >
              {label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2
              bg-white/30 border border-white/40 hover:bg-white/50 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-white/30 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile / Tablet Dropdown */}
      <div
        className={`lg:hidden absolute left-0 w-full bg-teal-900/95 backdrop-blur-xl
          transition-all duration-300 overflow-hidden
          ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col gap-2 p-4 text-white">
          {menuItems.map(([label, path]) => (
            <button
              key={label}
              onClick={() => {
                navigate(path)
                setMobileMenuOpen(false)
              }}
              className={`py-3 px-4 rounded-lg text-left text-base transition
                ${location.pathname === path
                  ? "bg-white/30 border border-white/40"
                  : "hover:bg-white/10"}
              `}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => {
              handleLogout()
              setMobileMenuOpen(false)
            }}
            className="mt-2 py-3 px-4 rounded-lg bg-cyan-500 text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default UserHeader
