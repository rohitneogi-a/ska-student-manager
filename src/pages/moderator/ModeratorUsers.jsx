import { useState, useEffect } from "react"
import { CircleAlert, Trash2, UserPlus } from "lucide-react"
import ModeratorLayout from "../../layouts/ModeratorLayout"
import { useHttp } from "../../components/hooks/useHttp"
import RippleSpinner from "../../components/common/RippleSpinner"
import Footertxt from "../../components/common/Footertxt"
import ViewModal from "../../components/admin/ViewModal"
import AddStudentModal from "../../components/moderator/AddstudentModal"
import { ConfirmDeleteModal } from "../../components/common/ConfirmDeleteModal"
import toast from "react-hot-toast"

const INITIAL_FORM = {
  fullName: "",
  guardianName: "",
  phoneNo: "",
  password: "",
  dob: "",
  subject: "",
  address: "",
  gender: "",
}

export default function ModeratorUsers() {
  const { get, post, del, loading, error } = useHttp()
  const [users, setUsers] = useState([])
  const [searchInput, setSearchInput] = useState("")
  const [genderFilter, setGenderFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [adding, setAdding] = useState(false)

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingUser, setDeletingUser] = useState(null)
  const [deleting, setDeleting] = useState(false)

  function formatDate(dateString) {
    const d = new Date(dateString)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  const fetchUsers = async () => {
    const res = await get(`/api/moderator/students`)
    if (res && res.success) {
      setUsers(
        res.data.students.map((u) => ({
          id: u._id,
          name: u.fullName,
          guardian: u.guardianName,
          phone: u.phoneNo,
          dob: u.dob || "",
          subject: u.subject,
          address: u.address,
          gender: u.gender,
          profileImage: u.profileImage,
          joined: formatDate(u.createdAt),
        }))
      )
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [get])

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "bg-[rgba(42,157,143,0.1)] text-[#2a9d8f]"
      case "DUE":  return "bg-[rgba(231,111,81,0.1)] text-[#e76f51]"
      default:     return "bg-gray-100 text-gray-500"
    }
  }

  const getStatusDotColor = (status) => {
    switch (status) {
      case "PAID": return "bg-teal-500"
      case "DUE":  return "bg-red-500"
      default:     return "bg-gray-500"
    }
  }

  const viewUser = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.phone && user.phone.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.subject && user.subject.toLowerCase().includes(searchInput.toLowerCase()))
    const matchesGender = genderFilter === "" || user.gender === genderFilter
    return matchesSearch && matchesGender
  })

  // ── Add Student Handlers ───────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setForm(INITIAL_FORM)
    setFormErrors({})
    setShowPassword(false)
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setForm(INITIAL_FORM)
    setFormErrors({})
    setShowPassword(false)
  }

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateForm = () => {
    const errors = {}
    if (!form.fullName.trim()) errors.fullName = "Full name is required"
    if (!form.guardianName.trim()) errors.guardianName = "Guardian name is required"
    if (!form.phoneNo.trim()) errors.phoneNo = "Phone number is required"
    else if (!/^\d{10}$/.test(form.phoneNo)) errors.phoneNo = "Enter a valid 10-digit phone number"
    if (!form.password.trim()) errors.password = "Password is required"
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters"
    if (!form.dob) errors.dob = "Date of birth is required"
    if (!form.subject.trim()) errors.subject = "Subject is required"
    if (!form.address.trim()) errors.address = "Address is required"
    if (!form.gender) errors.gender = "Gender is required"
    return errors
  }

  const handleAddStudent = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setAdding(true)
    const result = await post("/api/moderator/addStudent", {
      fullName: form.fullName,
      guardianName: form.guardianName,
      phoneNo: form.phoneNo,
      password: form.password,
      dob: form.dob,
      subject: form.subject,
      address: form.address,
      gender: form.gender,
    })
    setAdding(false)

    if (result?.success) {
      toast.success("Student added successfully")
      handleCloseAddModal()
      fetchUsers()
    } else {
      toast.error(result?.message || "Failed to add student")
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  // ── Delete Handlers ────────────────────────────────────────────────────────
  const handleDeleteClick = (user) => {
    setDeletingUser(user)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingUser(null)
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return

    setDeleting(true)
    const result = await del(`/api/moderator/deleteStudent/${deletingUser.id}`)
    setDeleting(false)

    if (result?.success) {
      toast.success("Student deleted successfully")
      handleCloseDeleteModal()
      fetchUsers()
    } else {
      toast.error(result?.message || "Failed to delete student")
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <ModeratorLayout>
      <div>
        <div className="min-h-screen font-page-title">
          <div className="p-4">
            {/* Page Title */}
            <div className="mb-8 text-center logo-animate">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Student Management
              </h2>
              <p className="text-gray-600">
                View, search, and manage all student accounts
              </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white card-animate rounded-xl shadow-sm p-6 mb-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-50">
                <label className="block text-slate-800 font-semibold text-sm mb-2">
                  Search Students
                </label>
                <input
                  type="text"
                  placeholder="Name, phone, subject..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-slate-800 font-semibold text-sm mb-2">
                  Filter by Gender
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Add Student Button */}
              <div className="flex items-end">
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm transition hover:scale-105 cursor-pointer shadow"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Student
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white card-animate rounded-xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-5 border-b-2 border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  All Students ({filteredUsers.length})
                </h3>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold border border-yellow-300 self-start sm:self-auto">
                  <CircleAlert className="w-4 h-4 shrink-0" />
                  <span>Tip: Click a candidate row to reveal more insights.</span>
                </span>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Student</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Phone</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Subject</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Gender</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Joined</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <div className="flex justify-center items-center">
                            <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-red-500">{error}</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">No students found.</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors card-hover cursor-pointer"
                          onClick={() => viewUser(user)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src =
                                    "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(user.name || "S")
                                }}
                              />
                              <span className="text-slate-800 font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                          <td className="px-6 py-4 text-gray-600">{user.subject}</td>
                          <td className="px-6 py-4 text-gray-600">{user.gender}</td>
                          <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total count footer */}
              <div className="px-6 py-4 border-t-2 border-gray-100">
                <p className="text-gray-600 text-sm">
                  Total: <span className="font-semibold text-slate-800">{filteredUsers.length}</span> student{filteredUsers.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {isModalOpen && (
          <ViewModal
            selectedUser={selectedUser}
            setIsModalOpen={setIsModalOpen}
            getStatusDotColor={getStatusDotColor}
            getStatusColor={getStatusColor}
            role="moderator"
          />
        )}

        {/* Add Student Modal */}
        <AddStudentModal
          show={showAddModal}
          onClose={handleCloseAddModal}
          form={form}
          formErrors={formErrors}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          adding={adding}
          onFormChange={handleFormChange}
          onSubmit={handleAddStudent}
        />

        {/* Delete Confirm Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Student"
          message={
            deleting
              ? "Deleting..."
              : `Are you sure you want to delete "${deletingUser?.name}"? This action cannot be undone.`
          }
          confirmText={deleting ? "Deleting..." : "Delete"}
        />

        <Footertxt />
      </div>
    </ModeratorLayout>
  )
}


