import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access an unauthorized route
    if (user.role === "MANAGER") {
      return <Navigate to="/manager/dashboard" replace />;
    }
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
