import useVerifyToken from "hooks/useVerifyToken";
import { useCallback, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { Backdrop, CircularProgress } from "@mui/material";

const PersistLogin = () => {
  // Set up loading state & backdrop
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const redirect = useCallback(() => {
    navigate("/login", {
      // Set sessionExpired to `true` to display warning on login form
      state: { from: location, sessionExpired: true },
      replace: true,
    });
  }, [location, navigate]);

  useVerifyToken(redirect, setLoading);

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
