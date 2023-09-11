// Project import
import NavItem from "./NavItem";
import ProfileTab from "../ProfileTab";

// MUI components
import { Drawer, List, Divider, Box } from "@mui/material";

const drawerWidth = 240;

const Navbar = ({ open, onToggle, menuItems, window }) => {
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
      <Box onClick={onToggle(false)}>
        <ProfileTab direction="column" isNavbarOpen={open} sx={{ my: 3 }} />
        <Divider sx={{ borderWidth: "1px" }} />
        <List>{items}</List>
      </Box>
    </Drawer>
  );
};

export default Navbar;
