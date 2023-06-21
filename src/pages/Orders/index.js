// Project import
import OrdersTable from "./OrdersTable";

// MUI components
import { Box, Typography } from "@mui/material";

const Orders = () => {
  return (
    <Box sx={{ py: 3, textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Orders
      </Typography>
      <OrdersTable />
    </Box>
  );
};

export default Orders;
