import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Sun, Menu, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  const handleLogout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("Role")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  return (
    <div>
      <header className="font-header-navbar fixed top-0 w-full z-50 glass">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white gradient-accent">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">SKA Manager</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate("/profile")} 
              className="transition hover:text-cyan-400 cursor-pointer"
            >
              Profile
            </button>
            <button 
              onClick={() => navigate("/settings")} 
              className="transition hover:text-cyan-400 cursor-pointer"
            >
              Settings
            </button>
            <button 
              onClick={() => navigate("/payments")} 
              className="transition hover:text-cyan-400 cursor-pointer"
            >
              Payments
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 transition border cursor-pointer border-white/20"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </nav>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full z-50 bg-gray-900/90 text-white backdrop-blur-md">
            <div className="flex flex-col space-y-2 p-4">
              <button 
                onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }} 
                className="py-2 px-2 rounded hover:bg-cyan-700 text-left"
              >
                Profile
              </button>
              <button 
                onClick={() => { navigate("/settings"); setMobileMenuOpen(false); }} 
                className="py-2 px-2 rounded hover:bg-cyan-700 text-left"
              >
                Settings
              </button>
              <button 
                onClick={() => { navigate("/payments"); setMobileMenuOpen(false); }} 
                className="py-2 px-2 rounded hover:bg-cyan-700 text-left"
              >
                Payments
              </button>
              
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="py-2 px-2 rounded bg-gradient-to-br from-teal-500 to-yellow-500 text-white font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}

export default UserHeader