import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

function NavItem() {
  return (
    <ListItem key={text} disablePadding>
      <ListItemButton>
        <ListItemIcon>
          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem;