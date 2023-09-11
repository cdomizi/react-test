import { useContext } from "react";
import { useNavigate } from "react-router";

// Project import
import ColorModeContext from "../../contexts/ColorModeContext";
import MenuItem from "./MenuItem";
import ProfileTab from "../ProfileTab";

// MUI components & icons
import {
  useTheme,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Container,
  Stack,
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
      <Container maxWidth="xl">
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
              fontStyle: "italic",
              textDecoration: "none",
              cursor: "pointer",
              mr: "auto",
            }}
          >
            myERP
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
            mr={4}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.id} title={item.title} url={item.url} />
            ))}
          </Stack>
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
      </Container>
    </AppBar>
  );
};

export default TopBar;
