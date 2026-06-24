import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ requiredRole }) {
    const token = localStorage.getItem("accessToken");
    const role  = localStorage.getItem("userRole");

    if (!token) return <Navigate to="/login" replace />;

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;