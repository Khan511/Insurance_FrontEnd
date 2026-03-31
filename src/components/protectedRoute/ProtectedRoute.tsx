import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { Spinner } from "react-bootstrap";
import { Outlet, Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps = {}) => {
  const location = useLocation();
  const { data: currentUser, isLoading, error } = useGetCurrenttUserQuery();

  // Show loading spinner while fetching user data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (error || !currentUser?.data?.user || currentUser.status !== 200) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRoles = currentUser.data.user.roles || [];

  // Check if roles are required for this route
  if (allowedRoles && allowedRoles.length > 0) {
    // Check if user has at least one of the required roles
    const hasRequiredRole = allowedRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRequiredRole) {
      // User doesn't have required role - redirect to unauthorized page or home
      console.warn(
        `Access denied: User with roles [${userRoles.join(", ")}] tried to access route requiring [${allowedRoles.join(", ")}]`,
      );
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // User is authenticated and has required roles (if any)
  return <Outlet />;
};
