import React, { useState } from "react";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d)) return "N/A";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function getMonthName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return monthNames[monthNumber - 1] || "N/A";
}

function getMonthAbbr(monthNumber) {
  const monthAbbrs = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return monthAbbrs[monthNumber - 1] || "N/A";
}

function getStatusTextColor(status) {
  switch (status) {
    case "PAID":
      return "text-[#2a9d8f]";
    case "PENDING":
    case "DUE":
      return "text-[#e76f51]";
    default:
      return "text-gray-500";
  }
}

function groupByYear(history) {
  const groups = new Map();
  history.forEach((payment) => {
    const year = payment.year ?? "Unknown";
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(payment);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, payments]) => [
      year,
      [...payments].sort((a, b) => (b.month ?? 0) - (a.month ?? 0)),
    ]);
}

function PaymentHistoryPanel({ paymentHistory }) {
  const [expandedKey, setExpandedKey] = useState(null);

  const history = paymentHistory || [];
  const yearGroups = groupByYear(history);

  const toggleMonth = (year, month) => {
    const key = `${year}-${month}`;
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  if (history.length === 0) {
    return <p className="text-sm text-gray-500">No payment records found.</p>;
  }

  return (
    <div className="space-y-2 text-sm">
      {yearGroups.map(([year, payments]) => (
        <div key={year}>
          <span className="font-semibold text-slate-800">{year}:</span>{" "}
          {payments.map((payment, idx) => {
            const key = `${year}-${payment.month}`;
            const isExpanded = expandedKey === key;
            return (
              <span key={idx}>
                <button
                  onClick={() => toggleMonth(year, payment.month)}
                  className={`cursor-pointer hover:underline ${getStatusTextColor(payment.status)} ${isExpanded ? "font-bold underline" : ""}`}
                >
                  {getMonthAbbr(payment.month)}
                </button>
                {idx < payments.length - 1 && <span className="text-gray-400">, </span>}
              </span>
            );
          })}

          {payments.map((payment, idx) => {
            const key = `${year}-${payment.month}`;
            if (expandedKey !== key) return null;
            return (
              <p key={idx} className="mt-1 text-xs text-gray-600">
                {getMonthName(payment.month)} {year} — Status: {payment.status || "N/A"}, Amount:{" "}
                {payment.amount != null ? `₹${Number(payment.amount).toLocaleString()}` : "N/A"}, Receipt:{" "}
                {payment.receiptNo || "N/A"}, Paid on: {payment.status === "PAID" ? formatDate(payment.date) : "—"}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default PaymentHistoryPanel;
