import React, { useState, useEffect } from "react";
import ModeratorLayout from "../../layouts/ModeratorLayout";
import OverviewCards from "../../components/moderator/OverviewCards";
import { CircleAlert, Eye, Pencil, Trash2 } from "lucide-react";
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const result = await get("/api/moderator/students");
    if (result?.success) {
      setStudents(result.data?.students || []);
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
      case "PAID":
        return "bg-teal-500";
      case "DUE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
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
  const viewUser = (student) => {
    // Map fields to match what ViewModal expects
    setSelectedUser({
      id: student._id,
      name: student.fullName,
      guardian: student.guardianName,
      phone: student.phoneNo,
      subject: student.subject,
      dob: student.dob,
      address: student.address,
      profileImage: student.profileImage,
      gender: student.gender,
      createdAt: student.createdAt,
    });
    setIsModalOpen(true);
  };
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.fullName &&
        student.fullName.toLowerCase().includes(searchInput.toLowerCase())) ||
      (student.phoneNo &&
        student.phoneNo.toLowerCase().includes(searchInput.toLowerCase())) ||
      (student.subject &&
        student.subject.toLowerCase().includes(searchInput.toLowerCase()));

    const matchesGender =
      genderFilter === "" || student.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  return (
    <ModeratorLayout>
      <div className="min-h-screen font-page-title p-2">
        <div className="mt-4">
          <OverviewCards />
        </div>

        {/* Filter Bar */}
        <div className="bg-white  rounded-xl shadow-sm p-4 flex items-center justify-between mt-6  flex-wrap gap-4 card-hover card-animate">
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6 card-hover card-animate ">
          {/* Table Header */}
          <div className="px-6 py-5 border-b-2 border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              All Students ({filteredStudents.length})
            </h3>

            <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold border border-yellow-300 self-start sm:self-auto">
              <CircleAlert className="w-4 h-4 shrink-0" />
              <span>Tip: Click a student row to reveal more insights.</span>
            </span>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                    Guardian
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
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex justify-center items-center">
                        <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => viewUser(student)}
                    >
                      <td className="px-6 py-4 card-hover card-animate">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.profileImage}
                            alt={student.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(student.fullName || "S");
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-medium">
                              {student.fullName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.guardianName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.phoneNo}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.subject}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.gender}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(student.createdAt)}
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:scale-110 transition-transform flex items-center justify-center"
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

        </div>
                            {/* Modal */}
          {isModalOpen && (
            <ViewModal
              selectedUser={selectedUser}
              setIsModalOpen={setIsModalOpen}
              getStatusDotColor={getStatusDotColor}
              getStatusColor={getStatusColor}
              role="moderator" // Add this line
            />
          )}
      </div>
    </ModeratorLayout>
  );
}
