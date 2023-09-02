import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router";
import AuthContext from "../../contexts/AuthContext";

const RequireAuth = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  // If the user credentials are set in auth context, return page content
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    // Else redirect to login
    <Navigate to="/login/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
