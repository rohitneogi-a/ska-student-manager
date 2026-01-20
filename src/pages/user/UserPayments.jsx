import React, { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react";
import UserLayout from '../../layouts/UserLayout';
import Footertxt from '../../components/common/Footertxt';
import RippleSpinner from "../../components/common/RippleSpinner";
import { useHttp } from "../../components/hooks/useHttp";
import StatusDot from "../../components/common/StatusDot";
import UserPaymentDetailsModal from "../../components/user/UserPaymentDetailsModal";

function getStatusColor(status) {
  switch (status) {
    case "PAID":
      return "bg-[rgba(42,157,143,0.1)] text-[#2a9d8f]";
    case "DUE":
      return "bg-[rgba(231,111,81,0.1)] text-[#e76f51]";
    default:
      return "bg-gray-100 text-gray-500";
  }
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

function UserPayments() {
  const { get, loading, error } = useHttp();
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate year options (from 2025 to current year + 1)
  const generateYears = () => {
    const years = [];
    const startYear = 2025;
    const endYear = currentYear + 4;
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      const res = await get(`/api/user/myPayments?year=${selectedYear}`);
      if (res && Array.isArray(res.data)) {
        setSalaryHistory(res.data);
      } else {
        setSalaryHistory([]);
      }
    };
    fetchSalaryHistory();
  }, [get, selectedYear]);

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber - 1] || "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleRowClick = (record) => {
    setSelectedPayment(record);
    setIsModalOpen(true);
  };

  return (
    <UserLayout>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 font-page-title flex flex-col">
          <div className="rounded-lg p-4 sm:p-6 flex-1">
            <div className="flex mb-4 md:mb-6 justify-center items-center">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex gap-2 text-center">
                <IndianRupee className="" />
                Payment History
              </h2>
            </div>

            {/* Year Dropdown */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full sm:w-48 px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 bg-white"
              >
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}{year === currentYear ? " (Current Year)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 md:gap-3  ">
              
              <div className="text-base sm:text-lg font-bold text-gray-900  text-center">
                Payment Records for {selectedYear}:
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <RippleSpinner size={48} color="#0d9488" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : salaryHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No payment records found.</div>
              ) : (
                salaryHistory.map((record, idx) => {
                  const isPaid = record.status === "PAID";
                  return (
                    <div
                      key={idx}
                      onClick={() => handleRowClick(record)}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition card-hover card-animate cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold truncate text-gray-900">
                          {getMonthName(record.month)} {record.year}
                        </h4>
                        {isPaid && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {formatDate(record.date)} • {record.receiptNo}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        {isPaid && record.amount && (
                          <span className="text-sm sm:text-base font-semibold flex items-center text-gray-900">
                            <IndianRupee className="w-4" />
                            {record.amount.toLocaleString()}
                          </span>
                        )}
                        <span
                          className={`text-xs flex items-center gap-2 font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(record.status)}`}
                        >
                          <StatusDot
                            pingColor={getStatusDotColor(record.status)}
                            dotColor={getStatusDotColor(record.status)}
                          />
                          {isPaid ? "Paid" : "Due"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <Footertxt />

        {/* Payment Details Modal */}
        <UserPaymentDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          paymentData={selectedPayment}
        />
      </div>
    </UserLayout>
  );
}

export default UserPayments;
