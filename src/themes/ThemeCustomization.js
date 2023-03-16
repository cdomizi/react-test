import { useState, useMemo, useLayoutEffect } from "react";
import ColorModeContext from "../contexts/ColorModeContext";

// mui import
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";

const ThemeCustomization = ({ children }) => {
  const defaultMode = useMediaQuery("(prefers-color-scheme: light)")
    ? "light"
    : "dark";
  const initialState = localStorage.getItem("colorMode") || defaultMode;
  const [mode, setMode] = useState(initialState);

  useLayoutEffect(() => {
    localStorage.setItem("colorMode", mode);
  }, [mode]);

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
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeCustomization;
