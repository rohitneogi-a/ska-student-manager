import React, { useEffect } from 'react';
import { X, IndianRupee, Calendar, FileText, CheckCircle2, XCircle } from 'lucide-react';
import StatusDot from '../common/StatusDot';

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

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function UserPaymentDetailsModal({ isOpen, onClose, paymentData }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !paymentData) return null;

  const isPaid = paymentData.status === "PAID";

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center p-4 font-page-title">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white hover:bg-red-300 rounded-full w-8 h-8 flex items-center justify-center transition btn-primary"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Payment Details
        </h2>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${getStatusColor(paymentData.status)}`}>
            <StatusDot
              pingColor={getStatusDotColor(paymentData.status)}
              dotColor={getStatusDotColor(paymentData.status)}
            />
            <span className="font-bold text-lg">
              {isPaid ? "PAID" : "DUE"}
            </span>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          {/* Month & Year */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-5 h-5" />
              <p className="text-sm font-medium">Payment Period</p>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {getMonthName(paymentData.month)} {paymentData.year}
            </p>
          </div>

          {/* Amount */}
          {isPaid && paymentData.amount && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <IndianRupee className="w-5 h-5" />
                <p className="text-sm font-medium">Amount Paid</p>
              </div>
              <p className="text-2xl font-bold text-[#2a9d8f] flex items-center">
                <IndianRupee className="w-6 h-6" />
                {paymentData.amount.toLocaleString()}
              </p>
            </div>
          )}

          {/* Payment Date */}
          {isPaid && paymentData.date && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <p className="text-sm font-medium">Payment Date</p>
              </div>
              <p className="text-lg font-bold text-slate-800">
                {formatDate(paymentData.date)}
              </p>
            </div>
          )}

          {/* Receipt Number */}
          {isPaid && paymentData.receiptNo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FileText className="w-5 h-5" />
                <p className="text-sm font-medium">Receipt Number</p>
              </div>
              <p className="text-lg font-bold text-slate-800 font-mono">
                {paymentData.receiptNo}
              </p>
            </div>
          )}

          {/* Due Message */}
          {!isPaid && (
            <div className="bg-[rgba(231,111,81,0.1)] border-2 border-[#e76f51] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#e76f51] mb-2">
                <XCircle className="w-5 h-5" />
                <p className="text-sm font-bold">Payment Pending</p>
              </div>
              <p className="text-sm text-gray-600">
                Please contact the administrator to complete your payment for {getMonthName(paymentData.month)} {paymentData.year}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPaymentDetailsModal;