import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { Spinner } from "react-bootstrap";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoute = () => {
  const { data: currentUser, isLoading, error } = useGetCurrenttUserQuery();
  // if (isLoading) return <div>Loading...</div>;
  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );

  console.log("Current User in Protected Route:", currentUser);

  if (error || !currentUser?.data?.user || currentUser.status !== 200) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
