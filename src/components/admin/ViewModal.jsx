import React, { useEffect, useState } from 'react'
import StatusDot from "../../components/common/StatusDot";
import RippleSpinner from "../../components/common/RippleSpinner";
import PaymentModal from "./PaymentModal";
import { X, ChevronDown } from "lucide-react";
import { useHttp } from "../../components/hooks/useHttp";
import { TriangleAlert } from "lucide-react";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d)) return "N/A";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

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
      return "bg-[#2a9d8f]";
    case "DUE":
      return "bg-[#e76f51]";
    default:
      return "bg-gray-500";
  }
};

function getMonthName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthNumber - 1] || "N/A";
}

function ViewModal({ selectedUser, setIsModalOpen, hidePayment, role }) {
  
  const isModerator = role === "moderator";
  hidePayment = hidePayment || isModerator;
  
  const { get, loading, error } = useHttp();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(isModerator);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  

  // Get current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Generate year options (from 2020 to current year + 2)
  const generateYears = () => {
    const years = [];
    const startYear = 2020;
    const endYear = currentYear + 2;
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchPaymentDetails = async () => {
    if (selectedUser?.id && !hidePayment) {
      const res = await get(`/api/admin/${selectedUser.id}/payments?year=${selectedYear}&month=${selectedMonth}`);
      if (res && res.success) {
        setPaymentDetails(res.data);
      } else {
        setPaymentDetails(null);
      }
    }
  };



  const handleStudentDetailsToggle = () => {
    if (!isModerator) setIsStudentDetailsOpen((open) => !open);
  };
  useEffect(() => {
    if (!hidePayment) {
      fetchPaymentDetails();
    }
  }, [selectedUser, get, selectedYear, selectedMonth, hidePayment]);

  const handlePayNowClick = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh payment details after successful payment
    fetchPaymentDetails();
  };

  if (!selectedUser) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-2000 flex items-center justify-center p-2">
        <div className="bg-white rounded-xl p-3 max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Close Button (top right) */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white hover:bg-red-300 rounded-full w-8 h-8 flex items-center justify-center transition btn-primary"
          >
            <X />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Student Details
          </h2>

          {/* Student Details Accordion */}
          <div className="border border-gray-200 rounded-lg mb-3 card-animate">
            <button
              onClick={handleStudentDetailsToggle}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              disabled={isModerator}
            >
              <span className="font-semibold text-slate-800">Student Details</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isStudentDetailsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isStudentDetailsOpen && (
              <div className=" pt-0">
                <div className="flex flex-wrap gap-5 mb-2">
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Guardian Name</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.guardian}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Subject</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.subject}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.dob ? formatDate(selectedUser.dob) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details Accordion */}
          <div className="border border-gray-200 rounded-lg card-animate">
            <button
              onClick={() => !hidePayment && setIsPaymentDetailsOpen(!isPaymentDetailsOpen)}
              className={`w-full flex items-center justify-between p-4 transition ${
                hidePayment 
                  ? 'cursor-not-allowed bg-gray-50' 
                  : 'hover:bg-gray-50 cursor-pointer'
              }`}
              disabled={hidePayment}
            >
              <span className="font-semibold text-slate-800">Payment Details</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isPaymentDetailsOpen && !hidePayment ? 'rotate-180' : ''}`} />
            </button>
            
            {hidePayment ? (
              <div className="p-4 bg-amber-50 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <TriangleAlert className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-800">Payment Details Not Available</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Payment details are not visible for students created by moderators. Only admin-created students display payment information.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              isPaymentDetailsOpen && (
                <div className="p-2 pt-0">
                  {/* Year and Month Selector */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Select Year</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none"
                      >
                        {generateYears().map((year) => (
                          <option key={year} value={year}>
                            {year} {year === currentYear ? "(Current)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Select Month</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none"
                      >
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label} {month.value === currentMonth && selectedYear === currentYear ? "(Current)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment Details Table */}
                  <div className="w-full ">
                    {loading && (
                      <div className="flex justify-center py-8">
                        <RippleSpinner size={48} color="hsl(173, 80%, 40%)" />
                      </div>
                    )}
                    {error && <p className="text-center py-4 text-red-500">{error}</p>}
                    {!loading && !error && paymentDetails && Array.isArray(paymentDetails) && paymentDetails.length > 0 ? (
                      <div className="w-full  space-y-2">
                        {paymentDetails.map((payment, idx) => (
                          <div key={idx} className={`p-4 rounded-lg border border-gray-200 ${getStatusColor(payment.status)}`}>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm  text-gray-500 mb-1">Month</p>
                                <p className="font-medium">{getMonthName(payment.month)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                  <StatusDot 
                                    pingColor={getStatusDotColor(payment.status)}
                                    dotColor={getStatusDotColor(payment.status)}
                                  />
                                  <span className="font-medium text-sm">{payment.status}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">{payment.status === "DUE" ? "Action" : "Paid On"}</p>
                                {payment.status === "DUE" ? (
                                  <button
                                    onClick={() => handlePayNowClick(payment)}
                                    className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-sm font-semibold"
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <p className="font-medium text-[#2a9d8f]">{payment.date ? formatDate(payment.date) : "N/A"}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      !loading && <p className="text-center py-4 text-gray-500">No payment details found for the selected period.</p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {!hidePayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          userId={selectedUser.id}
          year={selectedYear}
          month={selectedMonth}
          monthName={getMonthName(selectedMonth)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}

export default ViewModal
