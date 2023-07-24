// MUI components & icons
import { Alert, Snackbar, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

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
        variant="filled"
        severity={openSnackbar.success ? "success" : "error"}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {openSnackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
