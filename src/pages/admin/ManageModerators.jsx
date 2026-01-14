import React, { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, AlertCircle } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useHttp } from "../../components/hooks/useHttp";
import RippleSpinner from "../../components/common/RippleSpinner";
import StatusDot from "../../components/common/StatusDot";

export default function ManageModerators() {
  const { get, loading, error } = useHttp();
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
          joined: new Date(mod.createdAt).toISOString().split("T")[0],
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
        moderators.map((m) => (m.id === editingId ? { ...m, ...formData } : m))
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

  const confirmRemove = () => {
    if (removingId) {
      setModerators(moderators.filter((m) => m.id !== removingId));
      setIsConfirmOpen(false);
      setRemovingId(null);
    }
  };

  const filteredModerators = moderators.filter(
    (mod) =>
      (mod.name && mod.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mod.email && mod.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAvatarInitials = (fullName) => {
    if (!fullName || typeof fullName !== "string") return "?";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="min-h-screen ">
        {/* Main Content */}
        <div className="px-4 mt-4 font-page-title">
          {/* Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Moderators</h2>
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
                onClick={handleAddModerator}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
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
                  <div className="h-15 w-15 rounded-full bg-gradient-to-br from-teal-500 to-yellow-400 flex items-center justify-center text-white font-bold text-lg">
                    {getAvatarInitials(mod.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{mod.name}</h3>
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
                        pingColor={
                          mod.status === "active" ? "bg-teal-500" : "bg-red-500"
                        }
                        dotColor={
                          mod.status === "active" ? "bg-teal-500" : "bg-red-500"
                        }
                      />
                      <span
                        className={`text-xs font-semibold ${
                          mod.status === "active"
                            ? "text-teal-700"
                            : "text-red-700"
                        }`}
                      >
                        {mod.status ? mod.status.toUpperCase() : "UNKNOWN"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditModerator(mod.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 py-2.5 font-semibold text-white transition-colors hover:bg-yellow-500"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveModerator(mod.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold text-slate-800">
                {editingId ? "Edit Moderator" : "Add New Moderator"}
              </h2>

              <form onSubmit={handleSubmitForm} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Department
                  </label>
                  <select
                    required
                    value={formData.dept}
                    onChange={(e) =>
                      setFormData({ ...formData, dept: e.target.value })
                    }
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  >
                    <option value="">Select Department</option>
                    <option value="Support">Support</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Status
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-lg bg-gray-200 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-teal-600 py-2.5 font-semibold text-white transition-colors hover:bg-teal-700"
                  >
                    Save Moderator
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Remove Modal */}
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-bold text-slate-800">
                  Confirm Action
                </h2>
              </div>
              <p className="mb-6 text-gray-600">
                Are you sure you want to remove this moderator? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex-1 rounded-lg bg-gray-200 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
