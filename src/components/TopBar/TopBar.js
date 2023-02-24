// mui components
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";

// mui icons
import { Menu as MenuIcon } from "@mui/icons-material";

function TopBar({ onToggle }) {
  return (
    <AppBar component="nav" position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2 }}
          onClick={onToggle(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          React Test
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
