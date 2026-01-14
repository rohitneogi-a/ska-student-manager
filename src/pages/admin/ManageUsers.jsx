import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusDot from "../../components/common/StatusDot";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useHttp } from "../../components/hooks/useHttp";

function ManageUsers() {
  const { get, loading, error } = useHttp();
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subFilter, setSubFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fetch all students (users) on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await get("/api/admin/allStudentsAdmin");
      if (res && Array.isArray(res.data)) {
        setUsers(
          res.data.map((u) => ({
            id: u._id,
            name: u.fullName,

            phone: u.phoneNo,
            dob: u.dob ? new Date(u.dob).toISOString().split("T")[0] : "",
            subject: u.subject,
            address: u.address,
            profileImage: u.profileImage,
            joined: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "",
            status: u.status || "active", // Default to active if not present
          }))
        );
      }
    };
    fetchUsers();
  }, [get]);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name
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

  const viewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchInput.toLowerCase())) ||
 
      (user.phone && user.phone.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.subject && user.subject.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.id && user.id.toLowerCase().includes(searchInput.toLowerCase()));
    const matchesStatus = statusFilter === "" || user.status === statusFilter;
    // No subscription filter for this data, but keep for future
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen font-page-title">
        <div className="p-4">
          <div className="mb-8 text-center logo-animate">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 ">
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
                placeholder="Name, phone, subject, or ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="flex-1 min-w-50">
              <label className="block text-slate-800 font-semibold text-sm mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Users Table Container */}
          <div className="bg-white card-animate rounded-xl shadow-sm overflow-hidden ">
            {/* Table Header */}
            <div className="px-6 py-5 border-b-2 border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                All Students ({filteredUsers.length})
              </h3>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto ">
              <table className="w-full min-w-max ">
                <thead className="bg-gray-50">
                  <tr className="card-hover">
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
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="card-hover">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 card-hover">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://ui-avatars.com/api/?name=" +
                                  encodeURIComponent(user.name || "S");
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="text-slate-800 font-medium">
                                {user.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                        <td className="px-6 py-4 text-gray-600">{user.subject}</td>
                        <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusDot
                              pingColor={getStatusDotColor(user.status)}
                              dotColor={getStatusDotColor(user.status)}
                            />
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status ? user.status.toUpperCase() : "ACTIVE"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewUser(user)}
                              className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 hover:scale-110 transition-transform flex items-center justify-center"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 hover:scale-110 transition-transform flex items-center justify-center"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:scale-110 transition-transform flex items-center justify-center"
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

            {/* Pagination */}
            <div className="px-6 py-5 border-t-2 border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 text-sm">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} students
              </p>
              <Pagination
                page={currentPage}
                count={totalPages}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "0.5rem",
                    marginLeft: "0.25rem",
                    marginRight: "0.25rem",
                  },
                  "& .MuiPaginationItem-page.Mui-selected": {
                    backgroundColor: "#0d9488",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0f766e",
                    },
                  },
                  "& .MuiPaginationItem-previousNext": {
                    borderRadius: "0.5rem",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-2000 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Student Details
              </h2>
              {selectedUser && (
                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Student ID</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.id}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Guardian Name</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.guardian}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Subject</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.subject}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.dob}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.address}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <StatusDot
                        pingColor={getStatusDotColor(selectedUser.status)}
                        dotColor={getStatusDotColor(selectedUser.status)}
                      />
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          selectedUser.status
                        )}`}
                      >
                        {selectedUser.status
                          ? selectedUser.status.toUpperCase()
                          : "ACTIVE"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
