import { RouterProvider } from "react-router-dom";
import ThemeCustomization from "./themes/ThemeCustomization";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { DialogProvider } from "./contexts/DialogContext";
import { AuthProvider } from "./contexts/AuthContext";

// Project import
import Routes from "./routes";

// MUI components
import { Box } from "@mui/material";

function App() {
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
}

export default App;
