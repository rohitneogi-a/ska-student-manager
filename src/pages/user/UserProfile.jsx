import { useState, useEffect } from "react"
import {
  Mail,
  Calendar,
  Phone,
  Copy,
  Edit,
  CheckCircle,
  MapPinHouse,
} from "lucide-react"
import { useHttp } from "../../components/hooks/useHttp"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import UserLayout from "../../layouts/UserLayout"
import RippleSpinner from "../../components/common/RippleSpinner"
import Footertxt from "../../components/common/Footertxt"

export default function UserProfile() {
  const [toastMsg, setToastMsg] = useState(null)
  const [userData, setUserData] = useState(null)
  const { get, loading } = useHttp()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    const result = await get("/api/user/profile")
    if (result?.success) {
      setUserData(result.data.user)
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

  if (loading || !userData) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#264653] via-[#2a9d8f] to-[#264653]">
          <div className="text-center">
            <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
            <p className="text-xl mt-4">Loading profile...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  const name = userData?.fullName || userData?.name || "User"
  const email = userData?.email || "N/A"
  const address = userData?.address || "N/A"
  const phone = userData?.phoneNo || userData?.phone || "N/A"
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('en-US', {
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
    <UserLayout>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-alert-card bg-linear-to-br from-[#e6f1ef] via-[#d4ede8] to-[#e6f1ef] px-4 md:px-8 lg:px-16">

        {/* Background Orbs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute rounded-full opacity-20 w-48 h-48 md:w-60 md:h-60 bg-[#e9c46a] top-[10%] left-[10%] animate-[float_20s_infinite_ease-in-out]" />
          <div className="absolute rounded-full opacity-20 w-36 h-36 md:w-48 md:h-48 bg-[#f4a261] bottom-[20%] right-[15%] animate-[float_20s_infinite_ease-in-out_5s]" />
          <div className="absolute rounded-full opacity-20 w-24 h-24 md:w-36 md:h-36 bg-[#2a9d8f] top-[60%] left-[20%] animate-[float_20s_infinite_ease-in-out_10s]" />
        </div>

        {/* Card */}
        <div className="rounded-3xl w-full max-w-xl md:max-w-2xl p-6 md:p-12 relative z-10 backdrop-blur-xl bg-white/60 border border-white/30 shadow-2xl animate-slideUp logo-animate">

          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-block relative mb-4 md:mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#e9c46a] to-[#f4a261] rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(233,196,106,0.3)]">
                <span className="text-xl md:text-2xl font-bold text-gray-800">
                  {avatarInitials}
                </span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-gray-900">
              {name}<div className="inline-flex items-center justify-center rounded-2xl bg-green-300/20 p-1">
  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#0e3632]" />
</div>
            </h1>
          </div>

          {/* Info */}
          <div className="space-y-4 mb-6 md:mb-8">
            
            <InfoItem
              icon={<MapPinHouse className="w-5 h-5 md:w-6 md:h-6" />}
              iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
              label="Address"
              value={address}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5 md:w-6 md:h-6" />}
              iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
              label="Member Since"
              value={memberSince}
            />
            <InfoItem
              icon={<Phone className="w-5 h-5 md:w-6 md:h-6" />}
              iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
              label="Phone Number"
              value={phone}
              onCopy={() => handleCopy(phone)}
            />
          </div>

          {/* Actions */}
          <div className="grid gap-4">
            <button
              onClick={handleEditProfile}
              className="w-full py-3 md:py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition cursor-pointer bg-gradient-to-br from-[#2a9d8f] to-[#264653] text-white shadow-lg"
            >
              <Edit className="w-5 h-5 md:w-6 md:h-6" /> Edit Profile
            </button>
          </div>

        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-4 md:right-6 rounded-2xl p-4 backdrop-blur-md z-50 bg-white/80 shadow-lg">
            <p className="font-semibold text-gray-800">{toastMsg.message}</p>
          </div>
        )}
      </div>
      
    </UserLayout>
  )
}

function InfoItem({ icon, iconBg, label, value, onCopy }) {
  return (
    <div className="rounded-2xl p-3 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/40 border border-white/20 shadow">
      <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm md:text-base text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900 break-words">{value}</p>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="text-[#2a9d8f] hover:text-[#e9c46a] transition mt-2 sm:mt-0">
          <Copy className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </div>
    
  )
}
