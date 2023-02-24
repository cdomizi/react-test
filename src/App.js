import { useState } from "react";
import { CssBaseline, Box } from "@mui/material";

// project import
import Main from "./components/Main/Main";
import Navbar from "./components/Navbar/Navbar";
import TopBar from "./components/TopBar/TopBar";

function App() {
  const [state, setState] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  return (
    <Box className="App">
      <CssBaseline />
      <TopBar onToggle={toggleDrawer} />
      <Navbar open={state} onToggle={toggleDrawer} />
      <Main />
    </Box>
  );
}

export default App;
