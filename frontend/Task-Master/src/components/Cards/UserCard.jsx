import React from "react";

function UserCard({ userInfo }) {
  return (
    <div className="user-card p-4 bg-white rounded shadow-md w-full max-w-3xl mx-auto">
      {/* User Info Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={userInfo.profileImageUrl || null}
            alt={userInfo.name}
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex  flex-col sm:flex-row  gap-3 mt-5 overflow-hidden">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completeTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
}

export default UserCard;

// StatCard component
const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-100";
      case "Completed":
        return "text-lime-600 bg-lime-100";
      default:
        return "text-violet-600 bg-violet-100";
    }
  };

  return (
    <div
      className={`flex-1 text-xs sm:text-sm  font-medium ${getStatusTagColor()} px-2 py-1 rounded text-start`}
    >
      <span className="block text-xs sm:text-sm font-semibold">{count}</span>
      {label}
    </div>
  );
};
