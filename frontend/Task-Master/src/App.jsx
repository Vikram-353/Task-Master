import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTasks from "./pages/Admin/CreateTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import UserProvider, { UserContext } from "./context/userContext";
// import RAG from "./pages/RAG";

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTasks />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              {/* <Route path="/admin/ask" element={<RAG />} /> */}
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route
                path="/user/user-dashboard-data"
                element={<UserDashboard />}
              />
              <Route path="/user/my-tasks" element={<MyTasks />} />
              <Route
                path="/user/task-detail/:id"
                element={<ViewTaskDetails />}
              />
              <Route path="/user/user" element={<ManageUsers />} />
              {/* <Route path="/user/ask" element={<RAG />} /> */}
            </Route>

            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
}

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return <Outlet />;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/admin/dashboard" />
  );
};
