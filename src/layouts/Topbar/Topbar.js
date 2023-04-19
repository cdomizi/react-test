import { useContext } from "react";

// project import
import ColorModeContext from "../../contexts/ColorModeContext";
import MenuItem from "./MenuItem";

// mui components
import {
  useTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

// mui icons
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";

function TopBar({ onToggle, menuItems }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { sm: "none" }, mr: 2 }}
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
            flexGrow: 1,
          }}
        >
          React Test
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {menuItems.map((item) => (
            <MenuItem key={item.id} title={item.title} url={item.url} />
          ))}
        </Box>
        <Tooltip
          title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
        >
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
