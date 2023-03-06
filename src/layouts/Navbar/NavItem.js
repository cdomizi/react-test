import {
  capitalize,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

function NavItem({ title, url, icon }) {
  const Icon = icon;
  const itemIcon = icon ? <Icon sx={{ fontSize: "1.5rem" }} /> : false;
  return (
    <ListItem disablePadding>
      <ListItemButton href={url}>
        {itemIcon && <ListItemIcon>{itemIcon}</ListItemIcon>}
        <ListItemText
          primary={capitalize(title)}
          primaryTypographyProps={{ variant: "h6" }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default NavItem;
