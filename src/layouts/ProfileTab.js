import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Project import
import AuthContext from "../contexts/AuthContext";
import publicApi from "../api/axios";
import SnackbarContext, { SNACKBAR_ACTIONS } from "../contexts/SnackbarContext";

// MUI components
import {
  Button,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback } from "react";
import useVerifyToken from "../hooks/useVerifyToken";

const ProfileTab = ({ direction = "row", isNavbarOpen, sx }) => {
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const { auth, setAuth } = useContext(AuthContext);
  const [retry, setRetry] = useState(false); // State to prevent endless loop

  const dispatch = useContext(SnackbarContext);

  // Verify/refresh access token
  useVerifyToken(false, false, retry, setRetry);

  const handleLogout = useCallback(async () => {
    // Delete `jwt` cookie containing the refreshToken
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await publicApi.get("logout", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // Display confirmation message on successful logout
      dispatch({
        type: SNACKBAR_ACTIONS.LOGOUT_SUCCESS,
        payload: { status: response?.status },
      });

      // Empty out auth context
      setAuth({});

      // Redirect the user to the home page on successful logout
      // and set sessionExpired to `false` (prevent display warning on login form)
      response?.status === 200 &&
        location.pathname.match(/\/users\/.+/) &&
        navigate("/", { state: { sessionExpired: false } });
    } catch (err) {
      // Display error message on failed logout
      dispatch({
        type: SNACKBAR_ACTIONS.LOGOUT_ERROR,
      });
    }
  }, [dispatch, location.pathname, navigate, setAuth]);

  return (
    <Stack
      direction={direction}
      spacing={2}
      useFlexGap
      sx={{ ...sx, alignItems: "center", mr: 2 }}
    >
      {auth?.accessToken ? (
        <>
          <Typography noWrap>
            Hi,{" "}
            <Tooltip title="User's profile">
              <Link
                onClick={() => navigate(`users/${auth?.username}`)}
                sx={{
                  ...(theme.palette.mode === "light" && {
                    color: isNavbarOpen ? "primary.main" : "inherit",
                    textDecorationColor: "inherit",
                  }),
                  cursor: "pointer",
                }}
              >
                {auth?.username}
              </Link>
            </Tooltip>
          </Typography>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              whiteSpace: "nowrap",
              ...(theme.palette.mode === "light" &&
                !isNavbarOpen && {
                  color: "primary.contrastText",
                  borderColor: "primary.contrastText",
                  "&:hover": {
                    borderColor: "primary.contrastText",
                    backgroundColor: "primary.light",
                  },
                }),
            }}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={() => navigate("/register", { state: { from: location } })}
            sx={{
              ...(theme.palette.mode === "light" && {
                ml: isNavbarOpen ? "inherit" : "auto",
                color: "primary.contrastText",
                backgroundColor: "primary.dark",
                "&:hover": {
                  color: "primary.contrastText",
                  backgroundColor: "primary.light",
                },
              }),
            }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/login", { state: { from: location } })}
            sx={{
              whiteSpace: "nowrap",
              ...(theme.palette.mode === "light" &&
                !isNavbarOpen && {
                  color: "primary.contrastText",
                  borderColor: "primary.contrastText",
                  "&:hover": {
                    borderColor: "primary.contrastText",
                    backgroundColor: "primary.light",
                  },
                }),
            }}
          >
            Log in
          </Button>
        </>
      )}
    </Stack>
  );
};

export default ProfileTab;

ProfileTab.propTypes = {
  direction: PropTypes.oneOf(["column", "row"]),
};
