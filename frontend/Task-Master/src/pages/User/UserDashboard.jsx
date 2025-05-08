import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashBoardLayout";

function UserDashboard() {
  useUserAuth();
  return <DashboardLayout>Dashboard</DashboardLayout>;
}

export default UserDashboard;
