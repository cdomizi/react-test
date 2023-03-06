import { useContext } from "react";
import { ColorModeContext } from "../../App";

import MenuItem from "./MenuItem";

// mui components
import { useTheme } from "@mui/material/styles";
import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";

// mui icons
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";

function TopBar({ open, onToggle, menuItems }) {
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
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
