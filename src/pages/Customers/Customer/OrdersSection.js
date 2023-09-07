import { memo } from "react";
import { formatOrderDate } from "../../../utils/formatStrings";

// MUI components & icons
import { Box, List, ListItem, ListItemIcon, Typography } from "@mui/material";
import { Circle as CircleIcon } from "@mui/icons-material";

// Customer orders section
const OrdersSection = memo(({ data }) => {
  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Orders by{" "}
        {data?.firstName && data?.lastName
          ? `${data.firstName} ${data.lastName}`
          : `Customer ${data?.id}`}
        :
      </Typography>
      {data?.orders?.length ? (
        <List>
          {data.orders.map((order) => (
            <ListItem key={order.id} sx={{ display: "block" }}>
              <ListItemIcon
                sx={{
                  "&, & .MuiListItemIcon-root": { minWidth: "2rem" },
                  verticalAlign: "sub",
                }}
              >
                <CircleIcon fontSize="small" />
              </ListItemIcon>
              {`#${order.id} on `}
              <Box component="span" fontWeight="bold">
                {`${formatOrderDate(order.createdAt)}`}
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        "No orders"
      )}
    </Box>
  );
});

export default OrdersSection;
