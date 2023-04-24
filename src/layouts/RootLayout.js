import { useState } from "react";
import { Outlet } from "react-router-dom";

// project import
import Navbar from "./Navbar/Navbar";
import Topbar from "./Topbar/Topbar";
import menuItems from "../menu-items";

// mui components
import { Box, Toolbar } from "@mui/material";

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
    <Box sx={{ display: "flex" }}>
      <Topbar onToggle={toggleDrawer} menuItems={menuItems} />
      <Navbar
        open={drawerState}
        onToggle={toggleDrawer}
        menuItems={menuItems}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default RootLayout;
