import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { CircleAlert, Eye, Pencil, Trash2 } from "lucide-react";
import StatusDot from "../../components/common/StatusDot";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useHttp } from "../../components/hooks/useHttp";
import ViewModal from "../../components/admin/ViewModal";
import Footertxt from "../../components/common/Footertxt";
import RippleSpinner from "../../components/common/RippleSpinner";

function ManageUsers() {
  const { get, loading, error } = useHttp();
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const navigate = useNavigate();

  function formatDate(dateString) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Fetch students with pagination
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await get(
        `/api/admin/allStudentsAdmin?page=${currentPage}&limit=10`,
      );
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
          })),
        );
        setPagination(res.data.pagination);
      }
    };
    fetchUsers();
  }, [get, currentPage]);

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

  const viewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name &&
        user.name.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.phone &&
        user.phone.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.subject &&
        user.subject.toLowerCase().includes(searchInput.toLowerCase()));
    
    const matchesGender = genderFilter === "" || user.gender === genderFilter;
    const matchesStatus = statusFilter === "" || user.status === statusFilter;
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminLayout>
      <div>
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
            </div>

            {/* Users Table Container */}
            <div className="bg-white card-animate rounded-xl shadow-sm overflow-hidden ">
              {/* Table Header */}
              <div className="px-6 py-5 border-b-2 border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  All Students ({filteredUsers.length})
                </h3>

                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold border border-yellow-300 self-start sm:self-auto">
                  <CircleAlert className="w-4 h-4 shrink-0" />
                  <span>
                    Tip: Click a candidate row to reveal more insights.
                  </span>
                </span>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto ">
                <table className="w-full min-w-max ">
                  <thead className="bg-gray-50">
                    <tr className="">
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
                      <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center"
                        >
                          <div className="flex justify-center items-center">
                            <RippleSpinner
                              size={148}
                              color="hsl(173, 80%, 40%)"
                            />
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          No students found.
                        </td>
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
                                <span className="text-xs text-gray-500"></span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {user.subject}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {user.gender}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {user.joined}
                          </td>

                          {/* Separate Delete Button */}
                          <td
                            className="px-6 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2">
                              <button
                                className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:scale-110 transition-transform flex items-center justify-center btn-primary"
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
                  Showing{" "}
                  {((currentPage - 1) * pagination.limit) + 1}-
                  {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} students
                </p>
                <Pagination
                  page={currentPage}
                  count={pagination.totalPages}
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
            <ViewModal
              selectedUser={selectedUser}
              setIsModalOpen={setIsModalOpen}
              getStatusDotColor={getStatusDotColor}
              getStatusColor={getStatusColor}
            />
          )}
        </div>
        <Footertxt />
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
