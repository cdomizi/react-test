import { NavLink } from "react-router-dom";

import {
  capitalize,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const NavItem = ({ title, url, icon }) => {
  const Icon = icon;
  const itemIcon = icon ? <Icon sx={{ fontSize: "1.5rem" }} /> : false;

  return (
    <NavLink
      to={url}
      className={({ isActive }) => (isActive ? "active" : "")}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <ListItem sx={{ color: "inherit" }} disablePadding>
        <ListItemButton sx={{ ".active &&": { bgcolor: "action.selected" } }}>
          {itemIcon && <ListItemIcon>{itemIcon}</ListItemIcon>}
          <ListItemText
            primary={capitalize(title)}
            primaryTypographyProps={{ variant: "h6" }}
          />
        </ListItemButton>
      </ListItem>
    </NavLink>
  );
};

export default NavItem;
