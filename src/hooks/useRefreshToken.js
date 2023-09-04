import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import publicApi from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useContext(AuthContext);

  const refreshToken = async () => {
    // Get a new access token by hitting the `refresh` endpoint
    const response = await publicApi.get("refresh", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const {
      id,
      username,
      isAdmin,
      accessToken: newAccessToken,
    } = response.data;

    // Update the auth context with the new access token and admin status
    setAuth((prev) => ({
      ...prev,
      id,
      username,
      isAdmin,
      accessToken: newAccessToken,
    }));
    return response.data.accessToken;
  };

  return refreshToken;
};

export default useRefreshToken;
