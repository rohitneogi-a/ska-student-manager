import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  ChartNoAxesGantt,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useHttp } from "../../components/hooks/useHttp";
import RippleSpinner from "../../components/common/RippleSpinner";
import StatusDot from "../../components/common/StatusDot";
import Footertxt from "../../components/common/Footertxt";
import ModeratorRegisterModal from "../moderator/ModeratorRegister";
import toast from "react-hot-toast";
import { ConfirmDeleteModal } from "../../components/common/ConfirmDeleteModal";
import ModeratorDetails from "./ModeratorDetails";
import { useNavigate } from "react-router-dom";

export default function ManageModerators() {
  const { get, del, loading, error } = useHttp();
  const [moderators, setModerators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dept: "",
    status: "active",
  });

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  function formatDate(dateString) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  //   Fetch moderators from API
  useEffect(() => {
    const fetchModerators = async () => {
      const res = await get("/api/admin/allModerators");
      if (res && Array.isArray(res.data)) {
        const formattedData = res.data.map((mod) => ({
          id: mod._id,
          name: mod.fullName,
          email: mod.email,
          phone: mod.phoneNo,
          dept: mod.dept || "N/A",
          status: mod.status || "active",
          joined: formatDate(mod.createdAt),
          profileImage: mod.profileImage,
        }));
        setModerators(formattedData);
      }
    };
    fetchModerators();
  }, []);

  const handleAddModerator = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", dept: "", status: "active" });
    setIsModalOpen(true);
  };

  const handleEditModerator = (id) => {
    const mod = moderators.find((m) => m.id === id);
    if (mod) {
      setEditingId(id);
      setFormData({
        name: mod.name,
        email: mod.email,
        phone: mod.phone,
        dept: mod.dept,
        status: mod.status,
      });
      setIsModalOpen(true);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (editingId) {
      setModerators(
        moderators.map((m) => (m.id === editingId ? { ...m, ...formData } : m)),
      );
    } else {
      setModerators([
        ...moderators,
        {
          id: Date.now(),
          ...formData,
          joined: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveModerator = (id) => {
    setRemovingId(id);
    setIsConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if (removingId) {
      const res = await del(`/api/moderator/deleteModerator/${removingId}`);

      if (res && res.success) {
        // Remove from state immediately for better UX
        setModerators(moderators.filter((m) => m.id !== removingId));
        toast.success("Moderator removed successfully!");
        // Optional: refresh to sync with backend
        // await refreshModerators();
      } else {
        toast.error(res?.message || "Failed to remove moderator.");
      }
      setIsConfirmOpen(false);
      setRemovingId(null);
    }
  };

  const filteredModerators = moderators.filter(
    (mod) =>
      (mod.name && mod.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mod.email && mod.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const getAvatarInitials = (fullName) => {
    if (!fullName || typeof fullName !== "string") return "?";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-[rgba(42,157,143,0.1)] text-[#2a9d8f]";
      case "inactive":
        return "bg-[rgba(231,111,81,0.1)] text-[#e76f51]";
      case "suspended":
        return "bg-[rgba(233,196,106,0.2)] text-[#e9c46a]";
      default:
        return "";
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "active":
        return "bg-teal-500";
      case "inactive":
        return "bg-red-500";
      case "suspended":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const navigate = useNavigate();

  // Add this function to refresh the list after registration
  const refreshModerators = async () => {
    const res = await get("/api/admin/allModerators");
    if (res && Array.isArray(res.data)) {
      const formattedData = res.data.map((mod) => ({
        id: mod._id,
        name: mod.fullName,
        email: mod.email,
        phone: mod.phoneNo,
        dept: mod.dept || "N/A",
        status: mod.status || "active",
        joined: formatDate(mod.createdAt),
        profileImage: mod.profileImage,
      }));
      setModerators(formattedData);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="min-h-screen ">
          {/* Main Content */}
          <div className="px-4 mt-4 font-page-title">
            {/* Page Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pl-4 ">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Moderators
                </h2>
                <p className="text-gray-600">
                  Manage and monitor moderator accounts
                </p>
              </div>

              {/* Search Bar and Add Button */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search moderators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap btn-primary"
                >
                  <Plus className="h-5 w-5" />
                  Add Moderator
                </button>
              </div>
            </div>

            {/* Loading / Error */}

            {loading && (
              <div className="flex items-center justify-center">
                <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
              </div>
            )}
            {error && <div>Error: {error}</div>}

            {/* Moderators Grid */}
            <div className="grid auto-fill grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6 ">
              {filteredModerators.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 card-hover card-animate "
                >
                  {/* Moderator Header */}
                  <div className="mb-5 flex items-center gap-4">
                    <div className="h-15 w-15 rounded-full bg-linear-to-br from-teal-500 to-yellow-400 flex items-center justify-center text-white font-bold text-lg">
                      {getAvatarInitials(mod.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {mod.name}
                      </h3>
                      <span className="text-sm text-gray-500">Moderator</span>
                    </div>
                  </div>

                  {/* Moderator Details */}
                  <div className="mb-5 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium text-slate-800">
                        {mod.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium text-slate-800">
                        {mod.phone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-500">Joined</span>
                      <span className="text-sm font-medium text-slate-800">
                        {mod.joined}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="flex items-center gap-2">
                        <StatusDot
                          pingColor={getStatusDotColor(mod.status)}
                          dotColor={getStatusDotColor(mod.status)}
                        />
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            mod.status,
                          )}`}
                        >
                          {mod.status ? mod.status.toUpperCase() : "UNKNOWN"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 ">
                    <button
                      onClick={() => navigate(`/admin/moderators/${mod.id}`)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 py-2.5 font-semibold text-white transition-colors hover:bg-yellow-500 btn-primary "
                      
                    >
                      <ChartNoAxesGantt className="h-4 w-4" />
                      View More
                    </button>
                    <button
                      onClick={() => handleRemoveModerator(mod.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 font-semibold text-white transition-colors hover:bg-orange-600 btn-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footertxt />

        {/* Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmRemove}
          title="Confirm Delete"
          message="Are you sure you want to remove this moderator? This action cannot be undone."
          confirmText="Delete"
        />

        {/* Register Moderator Modal */}
        <ModeratorRegisterModal
          isOpen={isRegisterModalOpen}
          onClose={async (newModerator) => {
            setIsRegisterModalOpen(false);
            if (newModerator) {
              toast.success("Moderator registered successfully!");
              await refreshModerators();
            }
          }}
        />
      </div>
    </AdminLayout>
  );
}
