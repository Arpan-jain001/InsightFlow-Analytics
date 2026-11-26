import { Navigate, useLocation } from "react-router-dom";
import InsightLoader from "./ui/InsightLoader";
import { useAuth } from "../hooks/useAuth.js";

const AuthLoader = () => (
  <InsightLoader messages={["Checking access…", "Securing your session…"]} />
);

/**
 * ProtectedRoute — guards routes by auth + optional role check
 *
 * Usage:
 *   <ProtectedRoute>                          → any logged-in user
 *   <ProtectedRoute allowedRoles={["ADMIN"]}> → specific role only
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Please log in to continue." }}
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard instead of a generic /unauthorized
    const fallback =
      user.role === "SUPER_ADMIN"
        ? "/admin-dashboard"
        : user.role === "ORGANIZER"
        ? "/organizer-dashboard"
        : "/dashboard";

    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;