import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Eye, Pencil, Trash2, Download } from "lucide-react";
import StatusDot from "../../components/common/StatusDot";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

const users = [
    {
        id: "USR-1001",
        name: "John Doe",
        email: "john.doe@example.com",
        subscription: "Premium",
        status: "active",
        joined: "2024-01-15",
        lastActive: "2024-12-20",
    },
    {
        id: "USR-1002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        subscription: "Basic",
        status: "active",
        joined: "2024-02-10",
        lastActive: "2024-12-22",
    },
    {
        id: "USR-1003",
        name: "Robert Johnson",
        email: "robert.j@example.com",
        subscription: "Enterprise",
        status: "active",
        joined: "2024-01-05",
        lastActive: "2024-12-23",
    },
    {
        id: "USR-1004",
        name: "Emily Davis",
        email: "emily.d@example.com",
        subscription: "Free",
        status: "inactive",
        joined: "2024-03-20",
        lastActive: "2024-11-15",
    },
    {
        id: "USR-1005",
        name: "Michael Wilson",
        email: "michael.w@example.com",
        subscription: "Premium",
        status: "active",
        joined: "2024-04-12",
        lastActive: "2024-12-21",
    },
    {
        id: "USR-1006",
        name: "Sarah Brown",
        email: "sarah.b@example.com",
        subscription: "Basic",
        status: "suspended",
        joined: "2024-02-28",
        lastActive: "2024-10-05",
    },
    {
        id: "USR-1007",
        name: "David Martinez",
        email: "david.m@example.com",
        subscription: "Premium",
        status: "active",
        joined: "2024-05-08",
        lastActive: "2024-12-22",
    },
    {
        id: "USR-1008",
        name: "Lisa Anderson",
        email: "lisa.a@example.com",
        subscription: "Free",
        status: "active",
        joined: "2024-06-15",
        lastActive: "2024-12-20",
    },
    {
        id: "USR-1009",
        name: "James Taylor",
        email: "james.t@example.com",
        subscription: "Enterprise",
        status: "active",
        joined: "2024-03-30",
        lastActive: "2024-12-23",
    },
    {
        id: "USR-1010",
        name: "Patricia Garcia",
        email: "patricia.g@example.com",
        subscription: "Basic",
        status: "inactive",
        joined: "2024-07-22",
        lastActive: "2024-09-12",
    },
];

function ManageUsers() {
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [subFilter, setSubFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

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
            user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.id.toLowerCase().includes(searchInput.toLowerCase());
        const matchesStatus = statusFilter === "" || user.status === statusFilter;
        const matchesSubscription =
            subFilter === "" || user.subscription === subFilter;

        return matchesSearch && matchesStatus && matchesSubscription;
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
                {/* Main Content */}
                <div className="p-4">
                    {/* Page Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">
                            User Management
                        </h2>
                        <p className="text-gray-600">
                            View, search, and manage all user accounts
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-wrap gap-4">
                        <div className="flex-1 min-w-50">
                            <label className="block text-slate-800 font-semibold text-sm mb-2">
                                Search Users
                            </label>
                            <input
                                type="text"
                                placeholder="Name, email, or ID..."
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
                        <div className="flex-1 min-w-50">
                            <label className="block text-slate-800 font-semibold text-sm mb-2">
                                Subscription
                            </label>
                            <select
                                value={subFilter}
                                onChange={(e) => setSubFilter(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                            >
                                <option value="">All Plans</option>
                                <option value="Free">Free</option>
                                <option value="Basic">Basic</option>
                                <option value="Premium">Premium</option>
                                <option value="Enterprise">Enterprise</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table Container */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
                        {/* Table Header */}
                        <div className="px-6 py-5 border-b-2 border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-800">
                                All Users ({filteredUsers.length})
                            </h3>
                        </div>

                        {/* Table */}
                        <div className="w-full overflow-x-auto ">
                            <table className="w-full min-w-max">
                                <thead className="bg-gray-50">
                                    <tr className="card-hover">
                                        <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                                            User ID
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wide">
                                            Status
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
                                    {paginatedUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 card-hover">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-
                                                    linear-to-br from-teal-500 to-yellow-400 flex items-center justify-center text-white font-semibold text-sm">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-800 font-medium">
                                                            {user.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {user.id}
                                            </td>
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
                                                        {user.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {user.joined}
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
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-5 border-t-2 border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-gray-600 text-sm">
                                Showing {startIndex + 1}-
                                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                                {filteredUsers.length} users
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
                                User Details
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
                                        <p className="text-xs text-gray-500 mb-1">User ID</p>
                                        <p className="text-slate-800 font-medium">
                                            {selectedUser.id}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Email Address
                                        </p>
                                        <p className="text-slate-800 font-medium">
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Subscription Plan
                                        </p>
                                        <p className="text-slate-800 font-medium">
                                            {selectedUser.subscription}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Account Status</p>
                                        <p className="text-slate-800 font-medium capitalize">
                                            {selectedUser.status}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Join Date</p>
                                        <p className="text-slate-800 font-medium">
                                            {selectedUser.joined}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Last Active</p>
                                        <p className="text-slate-800 font-medium">
                                            {selectedUser.lastActive}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Total Payments</p>
                                        <p className="text-slate-800 font-medium">
                                            ${Math.floor(Math.random() * 5000)}
                                        </p>
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
