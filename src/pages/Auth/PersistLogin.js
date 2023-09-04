import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import AuthContext from "../../contexts/AuthContext";
import useRefreshToken from "../../hooks/useRefreshToken";

import { Backdrop, CircularProgress } from "@mui/material";

const PersistLogin = () => {
  // Set up loading state & backdrop
  const [loading, setLoading] = useState(true);
  const refreshToken = useRefreshToken();
  const { auth, setAuth } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize variable for cleanup
    let ignore = false;

    const verifyToken = async () => {
      try {
        // Sets a new access token if expired
        // as long as the refreshToken is valid
        await refreshToken();
      } catch (err) {
        console.error(err);
        // Refresh token expired, clean auth context
        setAuth({});
        // Redirect user to login
        navigate("/login", {
          // Set sessionExpired to `true` to display warning on login form
          state: { from: location, sessionExpired: true },
          replace: true,
        });
      } finally {
        !ignore && setLoading(false);
      }
    };

    // Only verify the token if there is no access token in auth context
    !auth?.accessToken ? verifyToken() : setLoading(false);

    return function cleanUp() {
      ignore = true;
    };
  }, [auth?.accessToken, location, navigate, refreshToken, setAuth]);

  return loading ? (
    <div>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  ) : (
    <Outlet />
  );
};

export default PersistLogin;
