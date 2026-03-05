import React, { useEffect, useState } from 'react'
import UserLayout from '../../layouts/UserLayout'
import { useHttp } from '../../components/hooks/useHttp'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MoreVertical,
  IndianRupee,
  ChartNoAxesCombined,
  HandCoins,
  Lightbulb,
} from "lucide-react"
import Footer from '../../components/common/Footer'
import Footertxt from '../../components/common/Footertxt'

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
    color: "bg-gradient-to-r from-green-400 to-green-600",
    trend: "up",
  },
  {
    label: "Total Due",
    amount: "$7,000",
    percentage: "+8.2%",
    icon: Clock,
    color: "bg-gradient-to-r from-orange-400 to-orange-600",
    trend: "up",
  },
  {
    label: "Pending",
    amount: "$2,100",
    percentage: "-5.1%",
    icon: AlertCircle,
    color: "bg-gradient-to-r from-red-400 to-red-600",
    trend: "down",
  },
];

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
  const { get, loading } = useHttp()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetchUserProfile()
    // eslint-disable-next-line
  }, [])

  const fetchUserProfile = async () => {
    const result = await get("/api/user/profile")
    
    if (result?.success) {
      setUserData(result.data.user)
      
    } else {
      console.error(result?.message || "Failed to fetch profile")
    }
  }

  return (
    <UserLayout>
      <div className="font-page-title min-h-screen">
        {/* Main Content */}
        <div className="w-full">
          <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 mb-6 md:mb-8 text-center md:text-left font-page-title">
          <div className="flex items-center gap-4">
            <img
              src={userData?.profileImage}
              alt={userData?.fullName}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border border-gray-200 shadow"
              onError={(e) => {
                e.target.onerror = null
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(userData?.fullName || "M")
              }}
            />
            <div className="text-left">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 logo-animate">
                Hi {userData?.fullName}!
              </h3>
              
              
            </div>
          </div>

          {/* Right side info */}
          
        </div>

            {/* Stats Cards - Flex */}
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
              {salaryStats.map((stat, idx) => {
                const IconComponent = stat.icon
                return (
                  <div
                    key={idx}
                    className="flex-1 min-w-[280px] sm:min-w-[250px] bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition card-hover card-animate"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Icon */}
                      <div className={`${stat.color} p-2 sm:p-3 rounded-lg text-white flex-shrink-0`}>
                        <IconComponent size={20} className="sm:w-6 sm:h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-right">
                        <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                          {stat.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Main Flex Layout */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-8  card-animate">
              {/* Left Content - Charts */}
              <div className="flex-1 flex flex-col gap-4 md:gap-6 ">
                {/* Salary Trend Chart */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 card-hover">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex gap-2" > <ChartNoAxesCombined className='' />
                    Fee Payment Trends
                  </h2>
                  <div className="h-[220px] sm:h-[260px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salaryChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="paid" fill="rgb(34, 197, 94)" name="Paid" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="due" fill="rgb(249, 115, 22)" name="Due" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Salary History */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 card-hover">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 flex gap-2"><IndianRupee className='' />Payment History</h2>
                    
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3 ">
                    {salaryHistory.map((record, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition card-hover"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {record.month}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {record.date} • {record.reference}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          <span className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">
                            ${record.amount.toLocaleString()}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${
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
              <div className="w-full lg:w-80 flex flex-col gap-4 md:gap-6">
                {/* Payment Breakdown */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 card-hover">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex gap-2"><HandCoins  />
                    Fees Breakdown
                  </h3>
                  <div className="flex flex-col gap-3 md:gap-4">
                    {paymentBreakdown.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                            {item.name}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                            ${item.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`${item.color} h-full transition-all duration-300`}
                            style={{ width: `${(item.amount / 4000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">Total</span>
                      <span className="text-base sm:text-lg font-bold text-gray-900">$5,000</span>
                    </div>
                  </div>
                </div>

                {/* Tip Card */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-100 card-hover">
                  <h3 className="text-lg sm:text-xl text-center font-bold text-gray-900 mb-2 flex gap-2 justify-center">
                    <Lightbulb /> Payment Tip
                  </h3>
                  <p className="text-xs sm:text-sm text-center text-gray-700 leading-relaxed">
                    Paying your fees early helps you avoid late charges, maintain a good payment record, and ensures uninterrupted access to services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        <Footertxt/>
        </div>
      </div>
    </UserLayout>
  )
}

export default UserDashboard
