import { useContext } from "react";

import AuthContext from "../../../contexts/AuthContext";
import AccountSettings from "./AccountSettings";
import AdminSection from "./AdminSection";

import { Box, Typography } from "@mui/material";

const Profile = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Box>
      <Box id="profile-title" mb={8}>
        <Typography variant="h3">
          Hi, {auth?.username}!
          {auth?.isAdmin && (
            <Typography color="text.disabled">Admin account</Typography>
          )}
        </Typography>
      </Box>
      <AccountSettings />
      {auth?.isAdmin && <AdminSection username={auth?.username} />}
    </Box>
  );
};

export default Profile;
