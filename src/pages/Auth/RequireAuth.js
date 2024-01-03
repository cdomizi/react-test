import AuthContext from "contexts/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

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
