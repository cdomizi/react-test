// project import
import NavItem from "./NavItem";

// mui components
import { Drawer, List, Typography, Divider } from "@mui/material";

const drawerWidth = 240;

function Navbar({ open, onToggle, menuItems, window }) {
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const items = menuItems.map((item) => (
    <NavItem key={item.id} title={item.title} url={item.url} icon={item.icon} />
  ));

  return (
    <Drawer
      component="nav"
      container={container}
      variant="temporary"
      open={open}
      onClose={onToggle(false)}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Typography variant="h6" sx={{ my: 3 }} />
      <Divider />
      <List>{items}</List>
    </Drawer>
  );
}

export default Navbar;
