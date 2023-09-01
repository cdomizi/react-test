import { useNavigate } from "react-router";

import { Typography } from "@mui/material";

const MenuItem = ({ title, url }) => {
  const navigate = useNavigate();

  return (
    <Typography
      onClick={() => navigate(url)}
      noWrap
      component="a"
      sx={{
        color: "inherit",
        textDecoration: "none",
        mr: 4,
        cursor: "pointer",
      }}
    >
      {title.toUpperCase()}
    </Typography>
  );
};

export default MenuItem;
