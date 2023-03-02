import { useState } from "react";
import { Outlet } from "react-router-dom";

// project import
import Navbar from "../components/Navbar/Navbar";
import TopBar from "../components/TopBar/TopBar";

function Layout() {
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

export default Layout;
