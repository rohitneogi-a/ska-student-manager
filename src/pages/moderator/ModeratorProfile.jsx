import { useState, useEffect, useRef } from "react"
import {
  Mail,
  Calendar,
  Phone,
  Edit,
  CheckCircle,
  MapPinHouse,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  User,
  Camera,
} from "lucide-react"
import { useHttp } from "../../components/hooks/useHttp"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import ModeratorLayout from "../../layouts/ModeratorLayout"
import RippleSpinner from "../../components/common/RippleSpinner"
import Footertxt from "../../components/common/Footertxt"
import ImgUpload from "../../components/common/ImgUpload"

export default function ModeratorProfile() {
  const [moderatorData, setModeratorData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editFields, setEditFields] = useState({})
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwordFields, setPasswordFields] = useState({ newPassword: "", confirmPassword: "" })
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [saving, setSaving] = useState(false)

  // Image modal states
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [imageError, setImageError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const { get, post, loading } = useHttp()
  const navigate = useNavigate()

  useEffect(() => {
    fetchModeratorProfile()
  }, [])

  const fetchModeratorProfile = async () => {
    const result = await get("/api/moderator/profile")
    if (result?.success) {
      setModeratorData(result.data?.moderator)
    } else {
      toast.error(result?.message || "Failed to fetch profile")
      if (result?.message?.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("Token")
        localStorage.removeItem("Role")
        navigate("/login")
      }
    }
  }

  const handleEditClick = () => {
    setEditFields({
      fullName: moderatorData?.fullName || "",
      email: moderatorData?.email || "",
      address: moderatorData?.address || "",
      phoneNo: moderatorData?.phoneNo || "",
    })
    setPasswordFields({ newPassword: "", confirmPassword: "" })
    setPasswordError("")
    setShowPasswordSection(false)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditFields({})
    setShowPasswordSection(false)
    setPasswordFields({ newPassword: "", confirmPassword: "" })
    setPasswordError("")
  }

  const handleTogglePasswordSection = () => {
    setShowPasswordSection((prev) => {
      if (prev) {
        setPasswordFields({ newPassword: "", confirmPassword: "" })
        setPasswordError("")
      }
      return !prev
    })
  }

  const handlePasswordFieldChange = (field, value) => {
    setPasswordFields((prev) => {
      const newPass = field === "newPassword" ? value : prev.newPassword
      const confirmPass = field === "confirmPassword" ? value : prev.confirmPassword
      if (confirmPass && newPass !== confirmPass) {
        setPasswordError("Passwords do not match")
      } else {
        setPasswordError("")
      }
      return { ...prev, [field]: value }
    })
  }

  const handleSave = async () => {
    if (showPasswordSection && passwordFields.newPassword) {
      if (passwordFields.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters")
        return
      }
      if (passwordFields.newPassword !== passwordFields.confirmPassword) {
        setPasswordError("Passwords do not match")
        toast.error("Passwords do not match")
        return
      }
    }

    setSaving(true)

    const formData = new FormData()
    formData.append("fullName", editFields.fullName)
    formData.append("email", editFields.email)
    formData.append("phoneNo", editFields.phoneNo)
    formData.append("address", editFields.address)
    if (showPasswordSection && passwordFields.newPassword) {
      formData.append("password", passwordFields.newPassword)
    }

    const result = await post("/api/moderator/editProfile", formData)
    setSaving(false)

    if (result?.success) {
      setModeratorData((prev) => ({
        ...prev,
        fullName: editFields.fullName,
        email: editFields.email,
        phoneNo: editFields.phoneNo,
        address: editFields.address,
      }))
      toast.success("Profile updated successfully")
      setIsEditing(false)
      setShowPasswordSection(false)
      setPasswordFields({ newPassword: "", confirmPassword: "" })
      setPasswordError("")
    } else {
      toast.error(result?.message || "Failed to update profile")
      setPasswordFields({ newPassword: "", confirmPassword: "" })
      setPasswordError("")
    }
  }

  // ── Image Upload Handlers ──────────────────────────────────────────────────
  const handleOpenImageModal = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setImageError("")
    setShowImageModal(true)
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    setImageError("")
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== "image/jpeg") {
      setImageError("Only JPG/JPEG images are allowed")
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be under 5 MB")
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    setImageError("")
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleImageUpload = async () => {
    if (!selectedFile) return

    setUploadingImage(true)

    const formData = new FormData()
    formData.append("fullName", moderatorData?.fullName || "")
    formData.append("email", moderatorData?.email || "")
    formData.append("phoneNo", moderatorData?.phoneNo || "")
    formData.append("address", moderatorData?.address || "")
    formData.append("profileImage", selectedFile)

    const result = await post("/api/moderator/editProfile", formData)
    setUploadingImage(false)

    if (result?.success) {
      setModeratorData((prev) => ({
        ...prev,
        profileImage:
          result?.data?.profileImage ||
          result?.data?.data?.profileImage ||
          previewUrl,
      }))
      toast.success("Profile image updated successfully")
      handleCloseImageModal()
    } else {
      toast.error(result?.message || "Failed to upload image")
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleFileSelect(fakeEvent)
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  if (loading || !moderatorData) {
    return (
      <ModeratorLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
          </div>
        </div>
        <Footertxt />
      </ModeratorLayout>
    )
  }

  const name = moderatorData?.fullName || "User"
  const email = moderatorData?.email || "N/A"
  const address = moderatorData?.address || "N/A"
  const phone = moderatorData?.phoneNo || "N/A"
  const profileImage = moderatorData?.profileImage || null
  const memberSince = moderatorData?.createdAt
    ? new Date(moderatorData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  return (
    <ModeratorLayout>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-alert-card px-4 md:px-8 lg:px-16">

        {/* Background Orbs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute rounded-full opacity-20 w-48 h-48 md:w-60 md:h-60 bg-[#e9c46a] top-[10%] left-[10%] animate-[float_20s_infinite_ease-in-out]" />
          <div className="absolute rounded-full opacity-20 w-36 h-36 md:w-48 md:h-48 bg-[#f4a261] bottom-[20%] right-[15%] animate-[float_20s_infinite_ease-in-out_5s]" />
          <div className="absolute rounded-full opacity-20 w-24 h-24 md:w-36 md:h-36 bg-[#2a9d8f] top-[60%] left-[20%] animate-[float_20s_infinite_ease-in-out_10s]" />
        </div>

        {/* Card */}
        <div className="rounded-3xl w-full max-w-xl md:max-w-2xl p-6 md:p-12 relative z-10 backdrop-blur-xl bg-white/60 border border-white/30 shadow-2xl animate-slideUp logo-animate my-8">

          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            {/* Avatar with camera button */}
            <div className="inline-block relative mb-4 md:mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(233,196,106,0.3)] bg-linear-to-br from-[#e9c46a] to-[#f4a261] flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 md:w-12 md:h-12 text-gray-700" />
                )}
              </div>

              {/* Camera edit button */}
              <button
                onClick={handleOpenImageModal}
                title="Update profile image"
                className="absolute -bottom-2 -right-2 w-8 h-8 md:w-9 md:h-9 bg-[#2a9d8f] hover:bg-[#264653] rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 cursor-pointer border-2 border-white"
              >
                <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-gray-900">
              {isEditing ? (editFields.fullName || name) : name}
              <div className="inline-flex items-center justify-center rounded-2xl bg-green-300/20 p-1">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#0e3632]" />
              </div>
            </h1>
            <p className="text-sm text-gray-500">{moderatorData?.role || "Moderator"}</p>
          </div>

          {/* Info / Edit Fields */}
          <div className="space-y-4 mb-6 md:mb-8">
            {isEditing ? (
              <>
                <EditableField
                  icon={<User className="w-5 h-5 md:w-6 md:h-6" />}
                  iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
                  label="Full Name"
                  value={editFields.fullName}
                  onChange={(v) => setEditFields((p) => ({ ...p, fullName: v }))}
                  placeholder="Enter full name"
                />
                <EditableField
                  icon={<Mail className="w-5 h-5 md:w-6 md:h-6" />}
                  iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
                  label="Email Address"
                  value={editFields.email}
                  onChange={(v) => setEditFields((p) => ({ ...p, email: v }))}
                  placeholder="Enter email"
                  type="email"
                />
                <EditableField
                  icon={<MapPinHouse className="w-5 h-5 md:w-6 md:h-6" />}
                  iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
                  label="Address"
                  value={editFields.address}
                  onChange={(v) => setEditFields((p) => ({ ...p, address: v }))}
                  placeholder="Enter address"
                />
                <EditableField
                  icon={<Phone className="w-5 h-5 md:w-6 md:h-6" />}
                  iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
                  label="Phone Number"
                  value={editFields.phoneNo}
                  onChange={(v) => setEditFields((p) => ({ ...p, phoneNo: v }))}
                  placeholder="Enter phone number"
                  type="tel"
                />

                {/* Change Password Toggle */}
                <button
                  type="button"
                  onClick={handleTogglePasswordSection}
                  className="w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer border-2 border-dashed border-[#2a9d8f]/50 text-[#2a9d8f] hover:bg-[#2a9d8f]/10"
                >
                  <Lock className="w-5 h-5" />
                  {showPasswordSection ? "Cancel Password Change" : "Change Password"}
                </button>

                {/* Password Section */}
                {showPasswordSection && (
                  <div className="rounded-2xl p-4 md:p-5 space-y-4 bg-white/50 border border-[#2a9d8f]/20 shadow">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-1">
                        <Lock className="w-4 h-4 text-[#2a9d8f]" />
                        Change Password
                      </p>
                      <p className="text-xs text-gray-400">
                        Leave blank or cancel to keep your current password
                      </p>
                    </div>

                    {/* New Password */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">New Password</p>
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          value={passwordFields.newPassword}
                          onChange={(e) => handlePasswordFieldChange("newPassword", e.target.value)}
                          placeholder="Enter new password (min 6 chars)"
                          className="w-full bg-white/70 border border-[#2a9d8f]/40 rounded-xl px-3 py-2 pr-10 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]/50 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2a9d8f] transition"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Confirm New Password</p>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          value={passwordFields.confirmPassword}
                          onChange={(e) => handlePasswordFieldChange("confirmPassword", e.target.value)}
                          placeholder="Re-enter new password"
                          className={`w-full bg-white/70 border rounded-xl px-3 py-2 pr-10 text-gray-900 font-semibold focus:outline-none focus:ring-2 transition ${
                            passwordError
                              ? "border-red-400 focus:ring-red-300"
                              : passwordFields.confirmPassword &&
                                passwordFields.newPassword === passwordFields.confirmPassword
                              ? "border-green-400 focus:ring-green-300"
                              : "border-[#2a9d8f]/40 focus:ring-[#2a9d8f]/50"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2a9d8f] transition"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Match indicator */}
                      {passwordFields.confirmPassword && (
                        <p className={`text-xs mt-1 font-medium ${passwordError ? "text-red-500" : "text-green-600"}`}>
                          {passwordError ? "✗ " + passwordError : "✓ Passwords match"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <InfoItem
                  icon={<Mail className="w-5 h-5 md:w-6 md:h-6" />}
                  iconBg="from-[#dbe7e4]/70 via-[#c7e3dc]/70 to-[#dbe7e4]/70"
                  label="Email Address"
                  value={email}
                />
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
                />
              </>
            )}
          </div>

          {/* Actions */}
          <div className="grid gap-3">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="py-3 md:py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition cursor-pointer bg-white/60 border border-gray-300 text-gray-700 shadow"
                >
                  <X className="w-5 h-5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !!passwordError}
                  className="py-3 md:py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition cursor-pointer bg-linear-to-br from-[#2a9d8f] to-[#264653] text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditClick}
                className="w-full py-3 md:py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition cursor-pointer bg-linear-to-br from-[#2a9d8f] to-[#264653] text-white shadow-lg"
              >
                <Edit className="w-5 h-5 md:w-6 md:h-6" /> Edit Profile
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Profile Image Upload Modal */}
      <ImgUpload
        show={showImageModal}
        onClose={handleCloseImageModal}
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        imageError={imageError}
        uploadingImage={uploadingImage}
        onFileSelect={handleFileSelect}
        onDrop={handleDrop}
        onUpload={handleImageUpload}
        fileInputRef={fileInputRef}
      />

      <Footertxt />
    </ModeratorLayout>
  )
}

function InfoItem({ icon, iconBg, label, value }) {
  return (
    <div className="rounded-2xl p-3 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/40 border border-white/20 shadow">
      <div className={`w-12 h-12 md:w-14 md:h-14 bg-linear-to-br ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 w-full">
        <p className="text-sm md:text-base text-gray-500 mb-1">{label}</p>
        <p className="font-semibold text-gray-900 wrap-break-word">{value}</p>
      </div>
    </div>
  )
}

function EditableField({ icon, iconBg, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="rounded-2xl p-3 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white/50 border border-[#2a9d8f]/30 shadow">
      <div className={`w-12 h-12 md:w-14 md:h-14 bg-linear-to-br ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 w-full">
        <p className="text-sm md:text-base text-gray-500 mb-1">{label}</p>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/70 border border-[#2a9d8f]/40 rounded-xl px-3 py-2 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]/50 transition"
        />
      </div>
    </div>
  )
}
