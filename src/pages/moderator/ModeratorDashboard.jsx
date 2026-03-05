import React, { useState, useEffect } from "react";
import ModeratorLayout from "../../layouts/ModeratorLayout";
import OverviewCards from "../../components/moderator/OverviewCards";
import { CircleAlert, Trash2, Calendar } from "lucide-react";
import { useHttp } from "../../components/hooks/useHttp";
import RippleSpinner from "../../components/common/RippleSpinner";
import ViewModal from "../../components/admin/ViewModal";

export default function DashboardSection() {
  const { get, loading, error } = useHttp();
  const [students, setStudents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moderatorProfile, setModeratorProfile] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchProfile();
  }, []);

  const fetchStudents = async () => {
    const result = await get("/api/moderator/students");
    if (result?.success) {
      const mapped = (result.data?.students || []).map((u) => ({
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
      }));
      setStudents(mapped);
    }
  };

  // Fetch moderator profile
  const fetchProfile = async () => {
    const result = await get("/api/moderator/profile");
    if (result?.success) {
      setModeratorProfile(result.data.moderator); // ✅ was result.data, now result.data.moderator
    }
  };

  function formatDate(dateString) {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const getStatusDotColor = (status) => {
    switch (status) {
      case "PAID": return "bg-teal-500";
      case "DUE":  return "bg-red-500";
      default:     return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "bg-[rgba(42,157,143,0.1)] text-[#2a9d8f]";
      case "DUE":  return "bg-[rgba(231,111,81,0.1)] text-[#e76f51]";
      default:     return "bg-gray-100 text-gray-500";
    }
  };

  const viewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = students.filter((user) => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.phone && user.phone.toLowerCase().includes(searchInput.toLowerCase())) ||
      (user.subject && user.subject.toLowerCase().includes(searchInput.toLowerCase()));
    const matchesGender = genderFilter === "" || user.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <ModeratorLayout>
      <div className="min-h-screen font-page-title p-2">
        {/* Moderator Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 mb-6 md:mb-8 text-center md:text-left font-page-title">
          <div className="flex items-center gap-4">
            <img
              src={moderatorProfile?.profileImage}
              alt={moderatorProfile?.fullName}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border border-gray-200 shadow"
              onError={(e) => {
                e.target.onerror = null
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(moderatorProfile?.fullName || "M")
              }}
            />
            <div className="text-left">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 logo-animate">
                Hi {moderatorProfile?.fullName}!
              </h3>
              
              
            </div>
          </div>

          {/* Right side info */}
          
        </div>

        <div className="mt-4">
          <OverviewCards totalStudents={moderatorProfile?.totalStudents ?? 0} />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between mt-6 flex-wrap gap-4 card-hover card-animate">
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

        {/* Students Table */}
        <div className="bg-white card-animate rounded-xl shadow-sm overflow-hidden mt-6">
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
                              e.target.onerror = null;
                              e.target.src =
                                "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(user.name || "S");
                            }}
                          />
                          <span className="text-slate-800 font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                      <td className="px-6 py-4 text-gray-600">{user.subject}</td>
                      <td className="px-6 py-4 text-gray-600">{user.gender}</td>
                      <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                      
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

        {/* Modal */}
        {isModalOpen && (
          <ViewModal
            selectedUser={selectedUser}
            setIsModalOpen={setIsModalOpen}
            getStatusDotColor={getStatusDotColor}
            getStatusColor={getStatusColor}
            role="moderator"
          />
        )}
      </div>
    </ModeratorLayout>
  );
}
