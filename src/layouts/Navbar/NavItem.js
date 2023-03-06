import {
  capitalize,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

function NavItem({ title, url, icon }) {
  const Icon = icon;
  const itemIcon = icon ? <Icon style={{ fontSize: "1.25rem" }} /> : false;
  return (
    <ListItem disablePadding>
      <ListItemButton href={url}>
        {itemIcon && <ListItemIcon>{itemIcon}</ListItemIcon>}
        <ListItemText primary={capitalize(title)} />
      </ListItemButton>
    </ListItem>
  );
}

export default NavItem;
