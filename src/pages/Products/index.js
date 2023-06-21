// Project import
import ProductsTable from "./ProductsTable";

// MUI components
import { Box, Typography } from "@mui/material";

const Products = () => {
  return (
    <Box sx={{ py: 3, textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Products
      </Typography>
      <ProductsTable />
    </Box>
  );
};

export default Products;
