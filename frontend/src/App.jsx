import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveHistory from "./pages/LeaveHistory";
import LeaveDetails from "./pages/LeaveDetails";
import PendingApprovals from "./pages/PendingApprovals";
import EmployeeProfile from "./pages/EmployeeProfile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="apply" element={<ApplyLeave />} />
          <Route path="history" element={<LeaveHistory />} />
          <Route path="leaves/:id" element={<LeaveDetails />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        {/* Manager Routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="approvals" element={<PendingApprovals />} />
          <Route path="leaves/:id" element={<LeaveDetails />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
