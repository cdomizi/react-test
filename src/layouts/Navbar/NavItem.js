import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

function NavItem(props) {
  const items = props.items;
  const groupItems = items.map((item) =>
    <ListItem key={item.id} disablePadding>
      <ListItemButton>
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText>
          {item.title}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
  return {groupItems};
};

export default NavItem;