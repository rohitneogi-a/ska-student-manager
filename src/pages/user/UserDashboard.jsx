import React from 'react'
import UserLayout from '../../layouts/UserLayout'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MoreVertical,
} from "lucide-react"

const salaryChartData = [
  { month: "Jan", paid: 5000, due: 0 },
  { month: "Feb", paid: 5000, due: 0 },
  { month: "Mar", paid: 5000, due: 0 },
  { month: "Apr", paid: 5000, due: 0 },
  { month: "May", paid: 5000, due: 0 },
  { month: "Jun", paid: 5000, due: 1200 },
  { month: "Jul", paid: 0, due: 5000 },
  { month: "Aug", paid: 5000, due: 0 },
  { month: "Sep", paid: 5000, due: 0 },
  { month: "Oct", paid: 5000, due: 0 },
  { month: "Nov", paid: 5000, due: 800 },
  { month: "Dec", paid: 5000, due: 0 },
]

const salaryStats = [
  {
    label: "Total Paid",
    amount: "$57,800",
    percentage: "+12.5%",
    icon: CheckCircle,
    color: "bg-green-500",
    trend: "up",
  },
  {
    label: "Total Due",
    amount: "$7,000",
    percentage: "+8.2%",
    icon: Clock,
    color: "bg-orange-500",
    trend: "up",
  },
  {
    label: "Pending",
    amount: "$2,100",
    percentage: "-5.1%",
    icon: AlertCircle,
    color: "bg-red-500",
    trend: "down",
  },
  {
    label: "Current Month",
    amount: "$5,000",
    percentage: "On Time",
    icon: Calendar,
    color: "bg-blue-500",
    trend: "neutral",
  },
]

const salaryHistory = [
  {
    month: "December 2025",
    amount: 5000,
    status: "paid",
    date: "Dec 1, 2025",
    reference: "SKA-12-2025",
  },
  {
    month: "November 2025",
    amount: 5000,
    status: "paid",
    date: "Nov 1, 2025",
    reference: "SKA-11-2025",
  },
  {
    month: "October 2025",
    amount: 5000,
    status: "paid",
    date: "Oct 1, 2025",
    reference: "SKA-10-2025",
  },
  {
    month: "September 2025",
    amount: 5000,
    status: "paid",
    date: "Sep 1, 2025",
    reference: "SKA-09-2025",
  },
  {
    month: "August 2025",
    amount: 5000,
    status: "due",
    date: "Aug 15, 2025",
    reference: "SKA-08-2025",
  },
]

const paymentBreakdown = [
  { name: "Base Salary", amount: 4000, color: "bg-cyan-500" },
  { name: "Bonus", amount: 600, color: "bg-teal-500" },
  { name: "Allowance", amount: 400, color: "bg-emerald-500" },
]

function UserDashboard() {
  return (
    <UserLayout>
      <div className="font-page-title min-h-screen">
        {/* Main Content */}
        <div className="w-full">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Salary Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">January 2025 - December 2025</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {salaryStats.map((stat, idx) => {
                const IconComponent = stat.icon
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg text-white`}>
                        <IconComponent size={24} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {stat.trend !== 'neutral' && (
                          stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
                        )}
                        {stat.percentage}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.amount}</p>
                  </div>
                )
              })}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Content - Charts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Salary Trend Chart */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Salary Trends</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salaryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="paid" fill="rgb(34, 197, 94)" name="Paid" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="due" fill="rgb(249, 115, 22)" name="Due" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Salary History */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Salary History</h2>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {salaryHistory.map((record, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{record.month}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {record.date} • {record.reference}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="font-semibold text-gray-900">${record.amount.toLocaleString()}</span>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              record.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {record.status === "paid" ? "Paid" : "Due"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Payment Breakdown */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Breakdown</h3>
                  <div className="space-y-4">
                    {paymentBreakdown.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-sm font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`${item.color} h-full`}
                            style={{ width: `${(item.amount / 4000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Total</span>
                      <span className="text-lg font-bold text-gray-900">$5,000</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-6 shadow-sm border border-cyan-100">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Paid on Time</span>
                      <span className="text-lg font-bold text-green-600">10/12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Late Payments</span>
                      <span className="text-lg font-bold text-orange-600">2/12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Avg. Days Delay</span>
                      <span className="text-lg font-bold text-red-600">5 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default UserDashboard
