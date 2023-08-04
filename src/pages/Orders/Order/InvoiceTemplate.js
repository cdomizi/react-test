import { forwardRef, useCallback, useMemo } from "react";
import { formatOrderDate, formatMoney } from "../../../utils/formatStrings";
import "./InvoiceTemplate.css";

// MUI components & icons
import { styled } from "@mui/material/styles";
import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const InvoiceTemplate = forwardRef(function InvoiceTemplate(props, ref) {
  const { data, products } = props?.data;

  const getItemTotal = useCallback(
    (price = 0, discount = 0, quantity = 1) =>
      formatMoney(price * (1 - discount / 100) * quantity, "dollars"),
    []
  );

  const subtotal = useMemo(() => 100, []);
  const taxRate = 19;
  const taxes = useMemo(() => subtotal * (taxRate / 100), [subtotal]);
  const total = useMemo(() => subtotal + taxes, [taxes, subtotal]);

  const InvoiceTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-last-of-type(-n + 3) td": {
      borderBottom: 0,
    },
    "& td:nth-last-of-type(-n + 2)": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  }));

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
            <Typography variant="subtitle2">
              <Box component="em">Your One-Stop Shop for Quality Products</Box>
            </Typography>
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
      <Stack direction="row" justifyContent="space-between" my={5}>
        <Box>
          <Typography variant="h6">Billed to:</Typography>
          <Typography>
            {`${data?.customer?.firstName} ${data?.customer?.lastName}`}
            <br />
            {`${data?.customer?.email}`}
            <br />
            {`${data?.customer?.address}`}
          </Typography>
        </Box>
        <Box>
          <Typography align="right">
            Invoice N.:{" "}
            <Box
              component="span"
              fontWeight="bold"
            >{`${data?.invoice?.idNumber}`}</Box>
            <br />
            Date:{" "}
            <Box component="span" fontWeight="bold">{`${formatOrderDate(
              data?.createdAt
            )}`}</Box>
            <br />
            Order:{" "}
            <Box component="span" fontWeight="bold">{`#${data?.id}`}</Box>
          </Typography>
        </Box>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.map((product, index) => (
            <InvoiceTableRow key={index}>
              <TableCell>{product?.product?.id}</TableCell>
              <TableCell>{product?.product?.title}</TableCell>
              <TableCell align="right">
                {formatMoney(product?.product?.price, "dollars")}
              </TableCell>
              <TableCell align="right">
                {product?.product?.discountPercentage}%
              </TableCell>
              <TableCell align="right">{product?.quantity}</TableCell>
              <TableCell align="right">
                {getItemTotal(
                  product?.product?.price,
                  product?.product?.discountPercentage,
                  product?.quantity
                )}
              </TableCell>
            </InvoiceTableRow>
          ))}
          <InvoiceTableRow>
            <TableCell rowSpan={3} />
            <TableCell rowSpan={3} />
            <TableCell rowSpan={3} />
            <TableCell rowSpan={3} />
            <TableCell>Subtotal</TableCell>
            <TableCell align="right">{formatMoney(100, "dollars")}</TableCell>
          </InvoiceTableRow>
          <InvoiceTableRow>
            <TableCell>{`Tax (${taxRate}%)`}</TableCell>
            <TableCell align="right">{formatMoney(taxes)}</TableCell>
          </InvoiceTableRow>
          <InvoiceTableRow>
            <TableCell>Total</TableCell>
            <TableCell align="right">{formatMoney(total)}</TableCell>
          </InvoiceTableRow>
        </TableBody>
      </Table>
      <pre>
        <code>{JSON.stringify(products, null, 2)}</code>
      </pre>
    </Box>
  );
});

export default InvoiceTemplate;
