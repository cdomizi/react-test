import { useState } from "react";

import { Box, Button, Drawer, Typography } from "@mui/material";

const TableDrawer = ({ drawerOpen, onSubmit, onClose }) => {
  const [data, setData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(data);
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen?.open || false}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: "22rem" },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
        <Typography variant="h4" mb={6}>
          Edit Item
        </Typography>
        <form onSubmit={handleSubmit}>
          <Button variant="contained">Save Edits</Button>
        </form>
      </Box>
    </Drawer>
  );
};

export default TableDrawer;
