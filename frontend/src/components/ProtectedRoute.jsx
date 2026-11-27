import { Navigate, useLocation } from "react-router-dom";
import InsightLoader from "./ui/InsightLoader";
import NotFound from "../pages/NotFound";
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

  /* Admin-only routes: anyone who is not a Super Admin sees a plain 404, so the URL is not revealed.
     (Real protection is the backend. This only avoids advertising the route.) */
  const adminOnly = allowedRoles.length > 0 && allowedRoles.every((r) => r === "SUPER_ADMIN");
  if (adminOnly && user?.role !== "SUPER_ADMIN") return <NotFound />;

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