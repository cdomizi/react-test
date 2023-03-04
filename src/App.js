import { useState, useMemo, createContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// project import
import Layout from "./routes/Layout";
import ErrorPage from "./components/Error/ErrorPage";
import Main from "./components/Main/Main";
import Products from "./components/Products/Products";

// mui components
import { CssBaseline, Box, useMediaQuery } from "@mui/material";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Main />} />
        <Route path="products" element={<Products />} />
      </Route>
    </Route>
  )
);

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
          <RouterProvider router={router} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Box>
  );
}

export default App;
export { ColorModeContext };
