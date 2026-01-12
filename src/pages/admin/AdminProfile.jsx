import { useState, useEffect } from "react"
import {
  Mail,
  User,
  Calendar,
  Phone,
  Upload,
  Copy,
  LogOut,
  Edit,
  Settings,
  DollarSign,
  FileText,
  CheckCircle,
  Zap,
} from "lucide-react"
import { useHttp } from "../../components/hooks/useHttp"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import AdminLayout from "../../layouts/AdminLayout"
import RippleSpinner from "../../components/common/RippleSpinner"

export default function AdminProfile() {
  const [toastMsg, setToastMsg] = useState(null)
  const [adminData, setAdminData] = useState(null)
  const { get, loading } = useHttp()
  const navigate = useNavigate()

  useEffect(() => {
    fetchAdminProfile()
  }, [])

  const fetchAdminProfile = async () => {
    const result = await get("/api/admin/profile")
    if (result?.success) {
      setAdminData(result.data) // <-- use result.data, not result.data.user
    } else {
      toast.error(result?.message || "Failed to fetch profile")
      if (result?.message?.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("Token")
        localStorage.removeItem("Role")
        navigate("/login")
      }
    }
  }

  const showToast = (message, type = "success") => {
    setToastMsg({ message, type })
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    showToast("Copied to clipboard!")
  }

  const handleEditProfile = () => {
    showToast("Opening profile editor...")
  }

  const handleLogout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("Role")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  // Move loading check inside UserLayout
  if (loading || !adminData) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#264653] via-[#2a9d8f] to-[#264653]">
          <div className="text-center">
            <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
            <p className="  text-xl mt-4">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const name = adminData?.fullName || adminData?.name || "User"
  const address = adminData?.address || adminData?.email || "N/A"
  const userId = adminData?._id || adminData?.userId || "N/A"
  const phone = adminData?.phoneNo || adminData?.phone || "N/A"
  const memberSince = adminData?.createdAt
    ? new Date(adminData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "N/A"
  const avatarInitials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center  relative overflow-hidden font-alert-card bg-gradient-to-br from-[#e6f1ef] via-[#d4ede8] to-[#e6f1ef]">

        {/* Background Orbs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute rounded-full opacity-20 w-[300px] h-[300px] bg-[#e9c46a] top-[10%] left-[10%] animate-[float_20s_infinite_ease-in-out]" />
          <div className="absolute rounded-full opacity-20 w-[200px] h-[200px] bg-[#f4a261] bottom-[20%] right-[15%] animate-[float_20s_infinite_ease-in-out_5s]" />
          <div className="absolute rounded-full opacity-20 w-[150px] h-[150px] bg-[#2a9d8f] top-[60%] left-[20%] animate-[float_20s_infinite_ease-in-out_10s]" />
        </div>

        {/* Card */}
        <div className="rounded-3xl w-full max-w-2xl p-8 md:p-12 relative z-10 backdrop-blur-xl bg-white/60 border border-white/30 shadow-2xl animate-slideUp logo-animate">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block relative mb-6">
              <div className="w-20 h-20 md:w-20 md:h-20 bg-gradient-to-br from-[#e9c46a] to-[#f4a261] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(233,196,106,0.3)]">
                <span className="text-2xl md:text-2xl font-bold text-gray-800">
                  {avatarInitials}
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-gray-900">
              {name}<CheckCircle className="w-4 h-4 text-[#0e3632]" />
            </h1>
          </div>

          {/* Info */}
          <div className="space-y-4 mb-8">
            <InfoItem
              icon={<Mail className="w-5 h-5" />}
              iconBg="from-[#2a9d8f] to-[#264653]"
              label="Address"
              value={address}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5" />}
              iconBg="from-[#f4a261] to-[#e76f51]"
              label="Member Since"
              value={memberSince}
            />
            <InfoItem
              icon={<Phone className="w-5 h-5" />}
              iconBg="from-[#264653] to-[#2a9d8f]"
              label="Phone Number"
              value={phone}
              onCopy={() => handleCopy(phone)}
            />
          </div>

          {/* Actions */}
          <div className="grid gap-4">
            <button
              onClick={handleEditProfile}
              className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition cursor-pointer bg-gradient-to-br from-[#2a9d8f] to-[#264653] text-white shadow-lg"
            >
              <Edit className="w-5 h-5" /> Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-2 pt-2 border-t border-white/40">
            <p className="text-base text-center mb-3 text-gray-700">Quick Actions</p>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={<Settings className="w-6 h-6" />} label="Settings" color="from-[#2a9d8f] to-[#264653]" />
              <QuickActionButton icon={<DollarSign className="w-6 h-6" />} label="Payments" color="from-[#e9c46a] to-[#f4a261]" />
              <QuickActionButton icon={<FileText className="w-6 h-6" />} label="Reports" color="from-[#f4a261] to-[#e76f51]" />
            </div>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-6 rounded-2xl p-4 backdrop-blur-md z-50 bg-white/80 shadow-lg">
            <p className="font-semibold text-gray-800">{toastMsg.message}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function InfoItem({ icon, iconBg, label, value, onCopy }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 bg-white/40 border border-white/20 shadow">
      <div className={`w-12 h-12 bg-gradient-to-br ${iconBg} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="text-[#2a9d8f] hover:text-[#e9c46a] transition">
          <Copy className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

function QuickActionButton({ icon, label, color }) {
  return (
    <button className="rounded-2xl p-2 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 bg-white/40 border border-white/20 shadow">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${color}`}>
        {icon}
      </div>
      <p className="font-semibold text-sm text-gray-900">{label}</p>
    </button>
  )
}
