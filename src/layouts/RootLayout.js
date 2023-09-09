import { useState } from "react";
import { Outlet } from "react-router-dom";

// Project import
import Navbar from "./Navbar";
import Topbar from "./Topbar";
import menuItems from "../menu-items";

// MUI components
import { Box, Container, Toolbar } from "@mui/material";

function RootLayout() {
  const [drawerState, setDrawerState] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState(open);
  };

  return (
    <Box id="root-layout-container">
      <Topbar onToggle={toggleDrawer} menuItems={menuItems} />
      <Navbar
        open={drawerState}
        onToggle={toggleDrawer}
        menuItems={menuItems}
      />
      <Container maxWidth="xl">
        <Box component="main" flexGrow={1} p={3}>
          <Toolbar />
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}

export default RootLayout;
