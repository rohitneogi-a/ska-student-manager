import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConfirmDeleteModal } from "../../components/common/ConfirmDeleteModal";
import {
  PencilLine,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  User,
  MapPin,
  Users,
  Eye,
  Trash2,
  CircleAlert,
} from "lucide-react";
import Footertxt from "../../components/common/Footertxt";
import AdminLayout from "../../layouts/AdminLayout";
import BackButton from "../../components/common/BackButton";
import toast from "react-hot-toast";
import { useHttp } from "../../components/hooks/useHttp";
import ViewModal from "../../components/admin/ViewModal";
import RippleSpinner from "../../components/common/RippleSpinner";

function ModeratorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, put, del, loading: httpLoading } = useHttp();

  const [moderator, setModerator] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    address: "",
  });

  useEffect(() => {
    fetchModeratorDetails();
  }, [id]);

  const fetchModeratorDetails = async () => {
    setLoading(true);
    try {
      const response = await get(`/api/admin/moderator/${id}`);

      if (response.success) {
        const {
          moderator: modData,
          students: studentsData,
          studentCount: count,
        } = response.data;
        setModerator(modData);

        // Format students data
        const formattedStudents = (studentsData || []).map((student) => ({
          id: student._id,
          name: student.fullName,
          guardian: student.guardianName,
          phone: student.phoneNo,
          dob: student.dob || "",
          subject: student.subject,
          address: student.address,
          gender: student.gender,
          profileImage: student.profileImage,
          joined: formatDate(student.createdAt),
        }));

        setStudents(formattedStudents);
        setStudentCount(count || 0);
        setFormData({
          fullName: modData.fullName || "",
          email: modData.email || "",
          phoneNo: modData.phoneNo || "",
          address: modData.address || "",
        });
      } else {
        toast.error(response.message || "Failed to fetch moderator details");
        navigate("/admin/moderators");
      }
    } catch (error) {
      toast.error("Error fetching moderator details");
      navigate("/admin/moderators");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    toast.loading("Saving changes...", { id: "save" });
    try {
      const response = await put(`/api/admin/moderator/${id}`, formData);

      if (response.success) {
        setModerator((prev) => ({ ...prev, ...formData }));
        setEditMode(false);
        toast.success("Moderator updated successfully", { id: "save" });
      } else {
        toast.error(response.message || "Failed to update moderator", {
          id: "save",
        });
      }
    } catch (error) {
      toast.error("Error updating moderator", { id: "save" });
    }
  };

  const handleDelete = async () => {
    toast.loading("Deleting moderator...", { id: "delete" });
    try {
      const response = await del(`/api/moderator/deleteModerator/${id}`);

      if (response.success) {
        toast.success("Moderator deleted successfully", { id: "delete" });
        navigate("/admin/moderators");
      } else {
        toast.error(response.message || "Failed to delete moderator", {
          id: "delete",
        });
        setShowDeleteModal(false);
      }
    } catch (error) {
      toast.error("Error deleting moderator", { id: "delete" });
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const viewStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-[rgba(42,157,143,0.1)] text-[#2a9d8f]";
      case "DUE":
        return "bg-[rgba(231,111,81,0.1)] text-[#e76f51]";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-teal-500";
      case "DUE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading || httpLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen font-page-title">
          <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 lg:p-10 min-h-screen font-page-title ">
        <div className="mb-6 cursor-pointer">
          <BackButton to="/admin/moderators" label="Back" />
        </div>

        <div className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 font-page-title card-hover ">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Moderator Details
                {!editMode && (
                  <button
                    className="ml-2 text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
                    onClick={() => setEditMode(true)}
                    title="Edit"
                  >
                    <PencilLine size={20} />
                  </button>
                )}
              </h1>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  className={`flex-1 sm:flex-none border px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    editMode
                      ? "text-slate-600 border-slate-300 bg-slate-100 hover:bg-slate-200"
                      : "text-red-600 border-red-300 hover:bg-red-50 bg-white"
                  }`}
                  onClick={() => {
                    if (editMode) {
                      setEditMode(false);
                      setFormData({
                        fullName: moderator.fullName,
                        email: moderator.email,
                        phoneNo: moderator.phoneNo,
                        address: moderator.address,
                      });
                    } else {
                      setShowDeleteModal(true);
                    }
                  }}
                >
                  {editMode ? "Cancel" : "Delete Moderator"}
                </button>
                <button
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all ${
                    editMode
                      ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-md"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                  disabled={!editMode}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-600" />
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    className={`w-full border border-slate-300 px-4 py-2.5 rounded-lg transition-all ${
                      editMode
                        ? "bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        : "bg-slate-200 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-600" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className={`w-full border border-slate-300 px-4 py-2.5 rounded-lg transition-all ${
                      editMode
                        ? "bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        : "bg-slate-200 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-600" />
                    Phone Number
                  </label>
                  <input
                    id="phoneNo"
                    value={formData.phoneNo || ""}
                    onChange={handleInputChange}
                    className={`w-full border border-slate-300 px-4 py-2.5 rounded-lg transition-all ${
                      editMode
                        ? "bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        : "bg-slate-200 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    Address
                  </label>
                  <input
                    id="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className={`w-full border border-slate-300 px-4 py-2.5 rounded-lg transition-all ${
                      editMode
                        ? "bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        : "bg-slate-200 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 card-hover">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 ">
              <div className="flex flex-col gap-2 p-4 bg-cyan-50 rounded-lg border border-cyan-200 card-hover">
                <span className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  <Calendar className="w-4 h-4 text-cyan-500" />
                  Joined Date
                </span>
                <span className="text-base text-cyan-900 font-medium">
                  {formatDate(moderator?.createdAt)}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200 card-hover">
                <span className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <PencilLine className="w-4 h-4 text-amber-500" />
                  Last Updated
                </span>
                <span className="text-base text-amber-900 font-medium">
                  {formatDate(moderator?.updatedAt)}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4 bg-teal-50 rounded-lg border border-teal-200 card-hover">
                <span className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <Users className="w-4 h-4 text-teal-500" />
                  Total Students
                </span>
                <span className="text-2xl font-bold text-teal-600">
                  {studentCount}
                </span>
              </div>
            </div>
          </div>

          {/* Students List Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 card-hover">
            {/* Table Header */}
            <div className="px-6 py-5 border-b-2 border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                All Students ({studentCount})
              </h3>

              <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold border border-yellow-300 self-start sm:self-auto">
                <CircleAlert className="w-4 h-4 shrink-0" />
                <span>Tip: Click a candidate row to reveal more insights.</span>
              </span>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-max table-auto ">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No students found for this moderator.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer card-hover"
                        onClick={() => viewStudent(student)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.profileImage}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://ui-avatars.com/api/?name=" +
                                  encodeURIComponent(student.name || "S");
                              }}
                            />
                            <span className="text-slate-800 font-medium">
                              {student.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {student.phone}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {student.subject}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {student.gender}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {student.joined}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Moderator"
          message="Are you sure you want to delete this moderator? This action cannot be undone."
          confirmText="Delete"
        />
      )}

      {/* Student View Modal */}
      {isModalOpen && (
        <ViewModal
          selectedUser={selectedStudent}
          setIsModalOpen={setIsModalOpen}
          getStatusDotColor={getStatusDotColor}
          getStatusColor={getStatusColor}
          hidePayment={true} // Add this prop
        />
      )}

      <Footertxt />
    </AdminLayout>
  );
}

export default ModeratorDetails;
