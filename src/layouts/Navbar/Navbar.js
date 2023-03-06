// mui components
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// mui icons
import { Mail as MailIcon } from "@mui/icons-material";

const drawerWidth = 240;

function Navbar({ open, onToggle }) {
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
      <List>
        <ListItem disablePadding>
          <ListItemButton href="/products">
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Navbar;
