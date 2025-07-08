import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoute = () => {
  const { data: currentUser, isLoading, error } = useGetCurrenttUserQuery();
  if (isLoading) return <div>Loading...</div>;

  console.log("Current User in Protected Route:", currentUser);

  if (error || !currentUser?.data?.user || currentUser.status !== 200) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
