// project import
import CustomersTable from "./CustomersTable";

// mui components
import { Box, Typography } from "@mui/material";

const Customers = () => {
  return (
    <Box sx={{ py: 3, textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Customers
      </Typography>
      <CustomersTable />
    </Box>
  );
};

export default Customers;
