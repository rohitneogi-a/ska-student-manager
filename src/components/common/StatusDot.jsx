
import React from "react";

const StatusDot = ({ pingColor, dotColor }) => {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pingColor} opacity-75`}
      ></span>
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`}
      ></span>
    </span>
  );
};

export default StatusDot;
