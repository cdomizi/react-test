// project import
import ProductTable from "./ProductTable";

// mui components
import { Box, Typography } from "@mui/material";

const Inventory = () => {
  return (
    <Box sx={{ py: 3, textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Inventory
      </Typography>
      <ProductTable />
    </Box>
  );
};

export default Inventory;
