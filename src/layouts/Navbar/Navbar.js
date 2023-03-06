// project import
import menuItems from "../../menu-items";
import NavItem from "./NavItem";

// mui components
import { Drawer, List } from "@mui/material";

const drawerWidth = 240;

function Navbar({ open, onToggle }) {
  const items = menuItems.map((item) => (
    <NavItem key={item.id} title={item.title} url={item.url} icon={item.icon} />
  ));

  return (
    <Drawer
      component="nav"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      anchor="left"
      open={open}
      onClose={onToggle(false)}
    >
      <List>{items}</List>
    </Drawer>
  );
}

export default Navbar;
