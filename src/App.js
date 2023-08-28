import { RouterProvider } from "react-router-dom";
import ThemeCustomization from "./themes/ThemeCustomization";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { DialogProvider } from "./contexts/DialogContext";

// project import
import MainRoutes from "./routes/MainRoutes";

// mui components
import { Box } from "@mui/material";

function App() {
  return (
    <Box className="App">
      <ThemeCustomization>
        <SnackbarProvider>
          <DialogProvider>
            <RouterProvider router={MainRoutes} />
          </DialogProvider>
        </SnackbarProvider>
      </ThemeCustomization>
    </Box>
  );
}

export default App;
