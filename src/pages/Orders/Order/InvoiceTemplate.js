import { forwardRef, memo, useCallback, useMemo } from "react";
import { formatOrderDate, formatMoney } from "../../../utils/formatStrings";

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

  const textColor = "#212121";
  const InvoiceContainer = styled(Box)(() => ({ color: textColor }));

  const InvoiceDivider = styled(Divider)(() => ({ borderColor: "#ddd" }));

  const InvoiceTableRow = styled(TableRow)(() => ({
    "& th": { fontWeight: "bold" },
    "&:nth-last-of-type(-n + 3) td": { borderBottom: 0 },
    "& td:nth-last-of-type(-n + 2)": {
      borderBottom: `1px solid #ddd`,
    },
    "&:last-of-type td": { borderBottom: 0, fontWeight: "bold" },
  }));

  const InvoiceTableCell = styled(TableCell)(() => ({
    color: textColor,
    borderColor: "#ddd",
  }));

  const InvoiceHeader = memo(
    () => (
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
    ),
    []
  );

  const InvoiceInfo = memo(
    () => (
      <Stack direction="row" justifyContent="space-between" my={9}>
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
            Order ID:{" "}
            <Box component="span" fontWeight="bold">{`#${data?.id}`}</Box>
          </Typography>
        </Box>
      </Stack>
    ),
    []
  );

  const InvoiceTable = memo(
    () => (
      <Table size={products?.length > 10 ? "small" : "medium"}>
        <TableHead>
          <InvoiceTableRow className="InvoiceTable">
            <InvoiceTableCell align="center">ID</InvoiceTableCell>
            <InvoiceTableCell align="center">Product</InvoiceTableCell>
            <InvoiceTableCell align="right">Qty.</InvoiceTableCell>
            <InvoiceTableCell align="right">Price</InvoiceTableCell>
            <InvoiceTableCell align="right">Discount</InvoiceTableCell>
            <InvoiceTableCell align="right">Total</InvoiceTableCell>
          </InvoiceTableRow>
        </TableHead>
        <TableBody>
          {products?.map((product, index) => (
            <InvoiceTableRow key={index}>
              <InvoiceTableCell align="center">
                {product?.product?.id}
              </InvoiceTableCell>
              <InvoiceTableCell>{product?.product?.title}</InvoiceTableCell>
              <InvoiceTableCell align="right">
                {product?.quantity}
              </InvoiceTableCell>
              <InvoiceTableCell align="right">
                {formatMoney(product?.product?.price, "dollars")}
              </InvoiceTableCell>
              <InvoiceTableCell align="right">
                {product?.product?.discountPercentage}%
              </InvoiceTableCell>
              <InvoiceTableCell align="right">
                {getItemTotal(
                  product?.product?.price,
                  product?.product?.discountPercentage,
                  product?.quantity
                )}
              </InvoiceTableCell>
            </InvoiceTableRow>
          ))}
          <InvoiceTableRow>
            <InvoiceTableCell rowSpan={3} />
            <InvoiceTableCell rowSpan={3} />
            <InvoiceTableCell rowSpan={3} />
            <InvoiceTableCell rowSpan={3} />
            <InvoiceTableCell align="right">Subtotal</InvoiceTableCell>
            <InvoiceTableCell align="right">
              {formatMoney(100, "dollars")}
            </InvoiceTableCell>
          </InvoiceTableRow>
          <InvoiceTableRow>
            <InvoiceTableCell align="right">{`Tax (${taxRate}%)`}</InvoiceTableCell>
            <InvoiceTableCell align="right">
              {formatMoney(taxes)}
            </InvoiceTableCell>
          </InvoiceTableRow>
          <InvoiceTableRow>
            <InvoiceTableCell align="right">Total</InvoiceTableCell>
            <InvoiceTableCell align="right">
              {formatMoney(total)}
            </InvoiceTableCell>
          </InvoiceTableRow>
        </TableBody>
      </Table>
    ),
    [getItemTotal, products, taxes, total]
  );

  return (
    <InvoiceContainer ref={ref} width="210mm" height="297mm">
      <InvoiceHeader />
      <InvoiceDivider sx={{ my: 1 }} />
      <InvoiceInfo />
      <InvoiceTable />
    </InvoiceContainer>
  );
});

export default InvoiceTemplate;
