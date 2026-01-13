import React from "react";

import { IndianRupee } from "lucide-react";
import UserLayout from '../../layouts/UserLayout'

import Footertxt from '../../components/common/Footertxt'
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
];

function UserPayments() {
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
            <div className="flex flex-col gap-2 md:gap-3">
              {salaryHistory.map((record, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition card-hover card-animate "
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
                    <span className="text-sm sm:text-base font-semibold text-gray-900 flex">
                      <IndianRupee className="w-4" /> {record.amount.toLocaleString()}
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
        <Footertxt />
      </div>
    </UserLayout>
  );
}

export default UserPayments;
