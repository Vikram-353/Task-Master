import React, { useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashBoardLayout";

function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);

  <DashboardLayout activeMenu="dashboard">Dashboard</DashboardLayout>;
}

export default Dashboard;
