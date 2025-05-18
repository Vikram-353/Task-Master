import React from "react";

function Progress({ progress, status }) {
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-cyan-500 text-cyan-500 border border-cyan-500/10";
      case "Completed":
        return "bg-lime-500 text-lime-500 border border-lime-500/10";
      default:
        return "bg-violet-500 text-violet-500 border border-violet-500/10";
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className={`${getColor()} h-1.5 rounded-full`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default Progress;
