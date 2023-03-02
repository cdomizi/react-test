// project import
import menuItems from "../menu-items";

// mui components
import { Box, Toolbar } from "@mui/material";

function Log({ value, replacer = null, space = 2 }) {
  return (
    <pre>
      <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
  );
}

function Main() {
  return (
    <Box component="main" padding={3}>
      <Toolbar />
      <Log value={menuItems} />
    </Box>
  );
}

export default Main;
