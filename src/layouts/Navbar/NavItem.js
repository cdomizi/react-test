import { useNavigate } from "react-router";

import {
  capitalize,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

function NavItem({ title, url, icon }) {
  const navigate = useNavigate();

  const Icon = icon;
  const itemIcon = icon ? <Icon sx={{ fontSize: "1.5rem" }} /> : false;

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => navigate(url)}>
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
