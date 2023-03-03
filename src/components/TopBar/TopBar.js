import { useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../../App";

// mui components
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";

// mui icons
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";

function TopBar({ onToggle }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
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
        <Typography
          href="/"
          variant="h6"
          noWrap
          component="a"
          sx={{
            color: "inherit",
            textDecoration: "none",
          }}
        >
          React Test
        </Typography>
        <IconButton
          onClick={colorMode.toggleColorMode}
          color="inherit"
          sx={{ marginLeft: "auto" }}
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
