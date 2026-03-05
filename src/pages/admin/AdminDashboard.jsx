import React, { useState, useEffect } from 'react'
import AdminLayout from "../../layouts/AdminLayout"
import { useHttp } from "../../components/hooks/useHttp"
import {
  Users,
  UserCheck,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
  CreditCard,
  User,
  AlertTriangle,
  Calendar,
  UserCog,
CircleUserRound 
} from "lucide-react"
import Footertxt from '../../components/common/Footertxt'
import { useNavigate } from "react-router-dom"

// --- Recent Activity Data ---
const activityItems = [
  { icon: CreditCard, text: "New payment received - $249.00", time: "2 minutes ago", color: "emerald" },
  { icon: User, text: "New user registered - john.doe@example.com", time: "15 minutes ago", color: "yellow" },
  { icon: AlertTriangle, text: "Payment failed - Insufficient funds", time: "1 hour ago", color: "red" },
  { icon: CreditCard, text: "Subscription renewed - Premium Plan", time: "2 hours ago", color: "emerald" },
  { icon: User, text: "Moderator added - sarah.smith@example.com", time: "5 hours ago", color: "yellow" },
]

const colorClasses = {
  emerald: "bg-emerald-100 text-emerald-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
}


function AdminDashboard() {
  const navigate = useNavigate()
  const { get } = useHttp()
  const [stats, setStats] = useState({
    totalStudents: 0,
    adminStudents: 0,
    moderatorStudents: 0,
    totalModerators: 0,
  })
  const [adminProfile, setAdminProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await get("/api/admin/profile")
      if (result?.success) {
        const d = result.data
        setStats({
          totalStudents: d.totalStudents ?? 0,
          adminStudents: d.adminStudents ?? 0,
          moderatorStudents: d.moderatorStudents ?? 0,
          totalModerators: d.totalModerators ?? 0,
        })
        setAdminProfile(d)
      }
    }
    fetchProfile()
  }, [get])

  const statsCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-emerald-100 text-emerald-600",
      onView: null, // No button
    },
    {
      title: "Total Moderators",
      value: stats.totalModerators,
      icon: UserCog,
      color: "bg-yellow-100 text-yellow-600",
      onView: () => navigate("/admin/moderators"),
    },
    {
      title: "Admin Students",
      value: stats.adminStudents,
      icon: UserCheck,
      color: "bg-blue-100 text-blue-600",
      onView: () => navigate("/admin/moderators"),
    },
    {
      title: "Moderator Students",
      value: stats.moderatorStudents,
      icon: CircleUserRound ,
      color: "bg-purple-100 text-purple-600",
      onView: null, // No button
    },
  ]

  return (
    <AdminLayout>
      <div className="min-h-screen font-page-title">
        <div className="p-4">
          {/* Admin Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 mb-6 md:mb-8 text-center md:text-left font-page-title">
            <div className="flex items-center gap-4">
              <img
                src={adminProfile?.profileImage}
                alt={adminProfile?.fullName}
                className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow"
                onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(adminProfile?.fullName || "A") }}
              />
              <div className="text-left">
                <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 logo-animate">
                  Hi {adminProfile?.fullName}!
                </h3>
                
                
              </div>
            </div>
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white p-3 md:p-6 rounded-2xl shadow-lg w-full card-animate card-hover">
                <div className="flex items-start justify-between min-w-fit gap-2 md:gap-4">
                  {/* Text */}
                  <div className="flex flex-col justify-between min-h-35 lg:min-h-37.5 gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm md:text-lg text-gray-600">{stat.title}</p>
                      <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    {stat.onView && (
                      <button
                        className="flex items-center gap-2 w-fit p-2 text-xs md:text-sm rounded-lg text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        onClick={stat.onView}
                      >
                        View List
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>
                  {/* Icon */}
                  <div className={`p-2 md:p-3 rounded-2xl ${stat.color}`}>
                    <stat.icon className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            {activityItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b-gray-300 justify-center border-b last:border-b-0"
              >
                <div className={`h-10 w-10 flex items-center justify-center rounded-full ${colorClasses[item.color]}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{item.text}</div>
                  <div className="text-xs text-gray-400">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footertxt />
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
