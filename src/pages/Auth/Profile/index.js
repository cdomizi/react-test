import { useParams } from "react-router-dom";
import AccountSettings from "./AccountSettings";
import AdminSection from "./AdminSection";

import { Box, Typography } from "@mui/material";

// Fake data for testing - REMOVE
const userData = {
  username: "testUsername",
  password: "testPassword",
  isAdmin: true,
  // "isAdmin": false,
};

const Profile = () => {
  const { id } = useParams();

  return (
    <Box>
      <Box id="profile-title" mb={8}>
        <Typography variant="h3">
          Hi, {userData.username}!
          {userData?.isAdmin && (
            <Typography color="text.disabled">Admin account</Typography>
          )}
        </Typography>
      </Box>
      <AccountSettings />
      {userData?.isAdmin && <AdminSection />}
    </Box>
  );
};

export default Profile;
