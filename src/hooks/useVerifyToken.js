import AuthContext from "contexts/AuthContext";
import useRefreshToken from "hooks/useRefreshToken";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const useVerifyToken = (
  redirect,
  setLoading,
  retry = null,
  setRetry = null
) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
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
        const newAccessToken = await refreshToken();
        newAccessToken && setIsTokenValid(true);
      } catch (err) {
        // On refresh token expired, clean auth context
        setAuth({});

        setIsTokenValid(false);

        // Redirect user to login
        redirect && redirect();
      } finally {
        !ignore && setLoading && setLoading(false);
      }
    };

    // Only verify the token if there is no access token in auth context
    !auth?.accessToken && (!retry ?? true)
      ? verifyToken()
      : setLoading && setLoading(false);

    return function cleanUp() {
      ignore = true;
      setRetry && setRetry(true);
    };
  }, [
    auth?.accessToken,
    location,
    navigate,
    redirect,
    refreshToken,
    retry,
    setAuth,
    setLoading,
    setRetry,
  ]);

  return isTokenValid;
};

export default useVerifyToken;

useVerifyToken.propTypes = {
  redirect: PropTypes.func,
  setLoading: PropTypes.func,
  retry: PropTypes.bool,
  setRetry: PropTypes.func,
};
