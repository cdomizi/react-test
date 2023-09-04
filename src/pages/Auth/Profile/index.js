import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import AuthContext from "../../../contexts/AuthContext";
import useAuthApi from "../../../hooks/useAuthApi";
import AccountSettings from "./AccountSettings";
import AdminSection from "./AdminSection";

import { Box, Typography } from "@mui/material";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useParams();
  const { auth, setAuth } = useContext(AuthContext);
  const authApi = useAuthApi();

  const fetchInitialState = useMemo(
    () => ({
      loading: true,
      error: null,
      data: undefined,
    }),
    []
  );
  const [fetchState, setfetchState] = useState(fetchInitialState);

  // Get current user data
  useEffect(() => {
    // Initialize AbortController & variable for cleanup
    const abortController = new AbortController();
    let ignore = false;

    // Get current user data
    const getUser = async () => {
      try {
        const response = await authApi.get(`users/${username}`, {
          signal: abortController.signal,
        });

        !ignore &&
          setfetchState((prevState) => ({
            ...prevState,
            loading: false,
            error: undefined,
            data: response.data,
          }));
      } catch (err) {
        // Check that error was not caused by abortController
        if (!abortController.signal.aborted) {
          console.error(err);

          // Session expired, set error state
          setfetchState((prevState) => ({
            ...prevState,
            loading: false,
            error: err,
            data: undefined,
          }));
          // Clean auth context
          setAuth({});
          // Redirect user to login page
          navigate("/login", {
            // Set sessionExpired to `true` to display warning on login form
            state: { from: location, sessionExpired: true },
            replace: true,
          });
        }

        return;
      }
    };

    getUser();

    return function cleanup() {
      ignore = true;
      abortController.abort();
    };
  }, [auth?.username, authApi, location, navigate, setAuth, username]);

  return (
    <Box>
      <Box id="profile-title" mb={8}>
        <Typography variant="h3">
          Hi, {fetchState?.data?.username}!
          {fetchState?.data?.isAdmin && (
            <Typography color="text.disabled">Admin account</Typography>
          )}
        </Typography>
      </Box>
      <AccountSettings />
      {fetchState?.data?.isAdmin && (
        <AdminSection username={fetchState?.data?.username} />
      )}
    </Box>
  );
};

export default Profile;
