import { RouterProvider } from "react-router-dom";
import ThemeCustomization from "./themes/ThemeCustomization";

// project import
import MainRoutes from "./routes/MainRoutes";
import ColorModeContext from "./contexts/ColorModeContext";

// mui import
import { Box } from "@mui/material";

function App() {
  return (
    <Box className="App">
      <ThemeCustomization>
        <RouterProvider router={MainRoutes} />
      </ThemeCustomization>
    </Box>
  );
}

export default App;
export { ColorModeContext };
