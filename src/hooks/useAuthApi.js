import { useContext, useEffect } from "react";
import { authApi } from "../api/axios";
import AuthContext from "../contexts/AuthContext";
import useRefreshToken from "./useRefreshToken";

const useAuthApi = () => {
  const { auth } = useContext(AuthContext);
  const refreshToken = useRefreshToken();

  useEffect(() => {
    // Add access token to Authorization headers
    const requestIntercept = authApi.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          // Only set the Authorization header if not present (i.e. on first try)
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }

        return config;
      },
      // On expired access token, reject the promise by returning an error
      (error) => Promise.reject(error)
    );

    const responseIntercept = authApi.interceptors.response.use(
      // If the access token is valid, return the response
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;

        // On expired access token, try getting a new one and retry the request
        if (error?.response?.status === 403 && !originalRequest?._retry) {
          // Set the `_retry` property to `true` to prevent an endless loop of retries
          originalRequest._retry = true;
          const newAccessToken = await refreshToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          // On updating the request with the new access token, send it again
          return authApi(originalRequest);
        }
        // On expired refresh token, reject the promise by returning an error
        return Promise.reject(error);
      }
    );

    // Cleanup fuction: remove attached interceptors
    // to prevent them from accumulate over multiple requests
    return () => {
      authApi.interceptors.request.eject(requestIntercept);
      authApi.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.accessToken, refreshToken]);

  return authApi;
};

export default useAuthApi;
