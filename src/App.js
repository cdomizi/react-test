import { useState, useMemo, createContext } from "react";
import { RouterProvider } from "react-router-dom";

// project import
import MainRoutes from "./routes/MainRoutes";

// mui
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, useMediaQuery } from "@mui/material";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <Box className="App">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={MainRoutes} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Box>
  );
}

export default App;
export { ColorModeContext };
