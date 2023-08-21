import PropTypes from "prop-types";

// MUI components
import {
  Button,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

const ProfileTab = ({ direction = "row", sx }) => {
  const theme = useTheme();

  return (
    <Stack
      direction={direction}
      spacing={2}
      useFlexGap
      sx={{ ...sx, alignItems: "center", mr: 2 }}
    >
      <Typography noWrap>
        Hi,{" "}
        <Tooltip title="User's profile">
          <Link
            href="#"
            sx={{
              ...(theme.palette.mode === "light" && {
                color: "inherit",
                textDecorationColor: "inherit",
              }),
            }}
          >
            User
          </Link>
        </Tooltip>
      </Typography>
      <Button
        variant="outlined"
        href="logout"
        sx={{
          whiteSpace: "nowrap",
          ...(theme.palette.mode === "light" && {
            color: "primary.contrastText",
            borderColor: "primary.contrastText",
            "&:hover": {
              borderColor: "primary.contrastText",
            },
          }),
        }}
      >
        Log out
      </Button>
      <Button
        variant="contained"
        href="register"
        sx={{
          ...(theme.palette.mode === "light" && {
            ml: "auto",
            color: "primary.main",
            backgroundColor: "primary.contrastText",
            "&:hover": {
              color: "primary.dark",
              backgroundColor: "primary.contrastText",
            },
          }),
        }}
      >
        Register
      </Button>
      <Button
        variant="outlined"
        href="login"
        sx={{
          whiteSpace: "nowrap",
          ...(theme.palette.mode === "light" && {
            color: "primary.contrastText",
            borderColor: "primary.contrastText",
            "&:hover": {
              borderColor: "primary.contrastText",
            },
          }),
        }}
      >
        Log in
      </Button>
    </Stack>
  );
};

export default ProfileTab;

ProfileTab.propTypes = {
  direction: PropTypes.oneOf(["column", "row"]),
};
