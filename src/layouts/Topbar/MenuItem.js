import { Typography } from "@mui/material";

const MenuItem = ({ title, url }) => {
  return (
    <Typography
      href={url}
      noWrap
      component="a"
      sx={{
        color: "inherit",
        textDecoration: "none",
        mr: 4,
      }}
    >
      {title.toUpperCase()}
    </Typography>
  );
};

export default MenuItem;
