import React, { useRef } from "react";

const DateField = ({ label, value, onChange, disabled = false }) => {
  const inputRef = useRef(null);
  // Use a fallback string for inputId if label is not a string
  const inputId =
    "date-input-" +
    (typeof label === "string"
      ? label.replace(/\s+/g, "-").toLowerCase()
      : "date");

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm mb-1 font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        }`}
        style={{ minHeight: "40px" }}
      />
    </div>
  );
};

export default DateField;