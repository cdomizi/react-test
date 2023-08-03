import { forwardRef } from "react";
import { Box } from "@mui/material";

const InvoiceTemplate = forwardRef(function InvoiceTemplate({ data }, ref) {
  return (
    <Box
      ref={ref}
      sx={{ width: "210mm", height: "297mm", border: "1px solid red" }}
    >
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </Box>
  );
});

export default InvoiceTemplate;
