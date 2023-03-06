import { useState } from "react";
import { Outlet } from "react-router-dom";

// project import
import Navbar from "./Navbar/Navbar";
import TopBar from "./TopBar/TopBar";

function RootLayout() {
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
    <>
      <TopBar onToggle={toggleDrawer} />
      <Navbar open={state} onToggle={toggleDrawer} />
      <Outlet />
    </>
  );
}

export default RootLayout;
