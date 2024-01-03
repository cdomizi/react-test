import { AuthProvider } from "contexts/AuthContext";
import { DialogProvider } from "contexts/DialogContext";
import { SnackbarProvider } from "contexts/SnackbarContext";
import { RouterProvider } from "react-router-dom";
import ThemeCustomization from "themes/ThemeCustomization";

// Project import
import Routes from "routes";

// MUI components
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box className="App">
      <ThemeCustomization>
        <SnackbarProvider>
          <DialogProvider>
            <AuthProvider>
              <RouterProvider router={Routes} />
            </AuthProvider>
          </DialogProvider>
        </SnackbarProvider>
      </ThemeCustomization>
    </Box>
  );
};

export default App;
