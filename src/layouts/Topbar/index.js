import { useContext } from "react";
import { useNavigate } from "react-router";

// project import
import ColorModeContext from "../../contexts/ColorModeContext";
import MenuItem from "./MenuItem";
import ProfileTab from "../ProfileTab";

// MUI components & icons
import {
  useTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";

const TopBar = ({ onToggle, menuItems }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const navigate = useNavigate();

  return (
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { md: "none" }, mr: 2 }}
          onClick={onToggle(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          onClick={() => navigate("/")}
          variant="h6"
          noWrap
          component="a"
          sx={{
            color: "inherit",
            textDecoration: "none",
            flexGrow: 1,
            cursor: "pointer",
          }}
        >
          React Test
        </Typography>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {menuItems.map((item) => (
            <MenuItem key={item.id} title={item.title} url={item.url} />
          ))}
        </Box>
        <ProfileTab
          direction="row"
          sx={{ display: { xs: "none", sm: "flex" } }}
        />
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
};

export default TopBar;
