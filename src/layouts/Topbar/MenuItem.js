import { NavLink } from "react-router-dom";

import { Button } from "@mui/material";

const MenuItem = ({ title, url }) => (
  <NavLink
    to={url}
    style={({ isActive }) => ({
      color: "inherit",
      textDecoration: "none",
      ...(isActive && {
        borderBottom: "1px solid white",
        borderRadius: 0,
      }),
    })}
  >
    <Button sx={{ color: "inherit" }}>{title.toUpperCase()}</Button>
  </NavLink>
);

export default MenuItem;
