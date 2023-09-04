import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

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
import CustomSnackbar from "../components/CustomSnackbar";

const ProfileTab = ({ direction = "row", sx }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { auth, setAuth } = useContext(AuthContext);

  // Set up snackbar
  const { snackbarState, dispatch } = useContext(SnackbarContext);

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
        navigate("/", { state: { sessionExpired: false } });
    } catch (err) {
      // Display error message on failed logout
      dispatch({
        type: SNACKBAR_ACTIONS.LOGOUT_ERROR,
      });
    }
  }, [dispatch, navigate, setAuth]);

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
                    color: "inherit",
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
              ...(theme.palette.mode === "light" && {
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
            onClick={() => navigate("/register")}
            sx={{
              ...(theme.palette.mode === "light" && {
                ml: "auto",
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
            onClick={() => navigate("/login")}
            sx={{
              whiteSpace: "nowrap",
              ...(theme.palette.mode === "light" && {
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
      <CustomSnackbar {...snackbarState} />
    </Stack>
  );
};

export default ProfileTab;

ProfileTab.propTypes = {
  direction: PropTypes.oneOf(["column", "row"]),
};
