// MUI components
import { Alert, Snackbar } from "@mui/material";

const CustomSnackbar = ({ openSnackbar, onClose }) => {
  return (
    <Snackbar
      open={openSnackbar.open}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: openSnackbar.vertical,
        horizontal: openSnackbar.horizontal,
      }}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={openSnackbar.success ? "success" : "error"}
      >
        {openSnackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
