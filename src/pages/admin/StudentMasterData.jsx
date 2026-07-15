import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useHttp } from "../../components/hooks/useHttp";
import { useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { CircleAlert, ChevronDown, MapPin, Download, CreditCard } from "lucide-react";
import RippleSpinner from "../../components/common/RippleSpinner";
import Footertxt from "../../components/common/Footertxt";
import PaymentHistoryPanel from "../../components/admin/PaymentHistoryPanel";
import { exportStudentsToPdf } from "../../utils/studentPdfExport";
import toast from "react-hot-toast";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d)) return "N/A";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function mapStudent(s) {
  const paymentHistory = (s.paymentHistory || s.payments || []).map((p) => ({
    month: p.month,
    year: p.year,
    amount: p.amount,
    status: p.status,
    receiptNo: p.receiptNo || p.receiptNumber,
    date: p.date || p.paymentDate,
  }));

  return {
    id: s._id,
    name: s.fullName,
    guardian: s.guardianName,
    phone: s.phoneNo,
    course: s.course || s.subject || "N/A",
    gender: s.gender || "N/A",
    address: s.address || "N/A",
    profileImage: s.profileImage,
    joined: s.createdAt || s.joiningDate,
    paymentHistory,
  };
}

export default function StudentMasterData() {
  const { get, loading, error } = useHttp();
  const { get: getForExport } = useHttp();
  const [students, setStudents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setSearchParams({ page: "1" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, courseFilter]);

  useEffect(() => {
    const fetchStudents = async () => {
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", "10");
      if (debouncedSearch) params.set("name", debouncedSearch);
      if (courseFilter) params.set("course", courseFilter);

      const res = await get(`/api/admin/studentDashboard?${params.toString()}`);
      if (res && res.success) {
        const mapped = (res.data.students || []).map(mapStudent);
        setStudents(mapped);
        setPagination(
          res.data.pagination || {
            total: mapped.length,
            page: currentPage,
            limit: 10,
            totalPages: 1,
          }
        );
        setCourseOptions((prev) => {
          const set = new Set(prev);
          mapped.forEach((s) => {
            if (s.course && s.course !== "N/A") set.add(s.course);
          });
          return Array.from(set).sort();
        });
      }
    };
    fetchStudents();
  }, [get, currentPage, debouncedSearch, courseFilter]);

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCard = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "100000");
      if (debouncedSearch) params.set("name", debouncedSearch);
      if (courseFilter) params.set("course", courseFilter);

      const res = await getForExport(`/api/admin/studentDashboard?${params.toString()}`);
      if (res && res.success) {
        const all = (res.data.students || []).map(mapStudent);
        if (all.length === 0) {
          toast.error("No students to export");
        } else {
          await exportStudentsToPdf(all);
          toast.success("PDF downloaded successfully");
        }
      } else {
        toast.error(res?.message || "Failed to fetch students for export");
      }
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="min-h-screen font-page-title">
          <div className="p-4">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 logo-animate">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Student Master Data
                </h2>
                <p className="text-gray-600">
                  Complete student records, courses, and payment history in one place
                </p>
              </div>
              <button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm transition hover:scale-105 cursor-pointer shadow btn-primary shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isExporting ? (
                  <RippleSpinner size={18} color="#ffffff" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white card-animate rounded-xl shadow-sm p-6 mb-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-50">
                <label className="block text-slate-800 font-semibold text-sm mb-2">
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-slate-800 font-semibold text-sm mb-2">
                  Filter by Course
                </label>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="">All Courses</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Data Container */}
            <div className="bg-white card-animate rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b-2 border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  All Students ({pagination.total})
                </h3>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold border border-yellow-300 self-start sm:self-auto">
                  <CircleAlert className="w-4 h-4 shrink-0" />
                  <span>Tip: Click a month chip to view full payment details.</span>
                </span>
              </div>

              {/* Loading / Error / Empty (shared) */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <RippleSpinner size={148} color="hsl(173, 80%, 40%)" />
                </div>
              ) : error ? (
                <div className="text-center py-16 text-red-500">{error}</div>
              ) : students.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  No students found.
                </div>
              ) : (
                <>
                  {/* Desktop / Tablet Table */}
                  <div className="hidden md:block w-full overflow-x-auto">
                    <table className="w-full min-w-max">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Student</th>
                          <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Guardian</th>
                          <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Phone</th>
                          <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Course</th>
                          <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Joined</th>
                          <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Gender</th>
                          <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">Payment History</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors card-hover">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={student.profileImage}
                                  alt={student.name}
                                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://ui-avatars.com/api/?name=" +
                                      encodeURIComponent(student.name || "S");
                                  }}
                                  loading="lazy"
                                />
                                <span className="text-slate-800 font-medium">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{student.guardian}</td>
                            <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                            <td className="px-6 py-4 text-gray-600">{student.course}</td>
                            <td className="px-6 py-4 text-gray-600">{formatDate(student.joined)}</td>
                            <td className="px-6 py-4 text-gray-600">{student.gender}</td>
                            <td className="px-6 py-4 min-w-64">
                              <PaymentHistoryPanel paymentHistory={student.paymentHistory} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {students.map((student) => {
                      const isExpanded = expandedCardId === student.id;
                      return (
                        <div key={student.id} className="p-4 card-animate">
                          <button
                            onClick={() => toggleCard(student.id)}
                            className="w-full flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={student.profileImage}
                                alt={student.name}
                                className="w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(student.name || "S");
                                }}
                                loading="lazy"
                              />
                              <div className="text-left min-w-0">
                                <p className="text-slate-800 font-medium truncate">{student.name}</p>
                                <p className="text-xs text-gray-500 truncate">{student.course} • {student.phone}</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>

                          {isExpanded && (
                            <div className="mt-4 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Guardian</p>
                                  <p className="text-sm font-medium text-slate-800">{student.guardian}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Gender</p>
                                  <p className="text-sm font-medium text-slate-800">{student.gender}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                  <p className="text-xs text-gray-500 mb-1">Joined</p>
                                  <p className="text-sm font-medium text-slate-800">{formatDate(student.joined)}</p>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" /> Address
                                </p>
                                <p className="text-sm font-medium text-slate-800">{student.address}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                  <CreditCard className="w-3.5 h-3.5" /> Payment History
                                </p>
                                <PaymentHistoryPanel paymentHistory={student.paymentHistory} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-5 border-t-2 border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-sm">
                      Showing {((currentPage - 1) * pagination.limit) + 1}-
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
                </>
              )}
            </div>
          </div>
        </div>
        <Footertxt />
      </div>
    </AdminLayout>
  );
}
