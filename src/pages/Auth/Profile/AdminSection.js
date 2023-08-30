import { Button, Divider, Typography } from "@mui/material";

const AdminSection = () => {
  return (
    <>
      <Divider sx={{ my: 7 }} />
      <Typography variant="h5" mb={5}>
        Admin Panel
      </Typography>
      <Button variant="contained" sx={{ maxWidth: "fit-content" }}>
        Manage users
      </Button>
    </>
  );
};

export default AdminSection;
