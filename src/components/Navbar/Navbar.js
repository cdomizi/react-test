// project import
import menuItems from "../menu-items";

// mui components
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// mui icons
import {
  Mail as MailIcon,
  MoveToInbox as InboxIcon,
} from "@mui/icons-material";

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
      <Divider />
      <List>
        {menuItems.groups.map((group, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemText primary={group.id} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Navbar;
