import { forwardRef } from "react";
import { formatOrderDate } from "../../../utils/formatStrings";
import "./InvoiceTemplate.css";

// MUI components & icons
import { Box, Divider, Stack, Typography } from "@mui/material";

const InvoiceTemplate = forwardRef(function InvoiceTemplate({ data }, ref) {
  return (
    <Box
      className="InvoiceContainer"
      ref={ref}
      border="1px solid red"
      width="210mm"
      height="297mm"
      p="10mm"
    >
      <Stack direction="row" alignItems="end" justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <Box>
            <Typography mt={1} variant="h5">
              GenCart Ltd.
            </Typography>
            <em>Your One-Stop Shop for Quality Products</em>
          </Box>
        </Stack>
        <Typography align="right" variant="body2">
          info@gencart.co.ll
          <br />
          +1 (123) 456-7890
          <br />
          123 Main Street, Anytown AB, 12345
        </Typography>
      </Stack>
      <Divider className="InvoiceDivider" sx={{ my: 1 }} />
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
      <Typography>
        Invoice N.{" "}
        <Box
          component="span"
          fontWeight="bold"
        >{`${data?.invoice?.idNumber}`}</Box>
        <br />
        Date:{" "}
        <Box component="span" fontWeight="bold">{`${formatOrderDate(
          data?.invoice?.createdAt
        )}`}</Box>
      </Typography>
    </Box>
  );
});

export default InvoiceTemplate;
