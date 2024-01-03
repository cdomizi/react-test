import { forwardRef, memo, useCallback, useContext } from "react";

// Project import
import SnackbarContext, { SNACKBAR_ACTIONS } from "contexts/SnackbarContext";
import useAuthApi from "hooks/useAuthApi";
import { formatOrderDate } from "utils/formatStrings";
import {
  getInvoiceStatus,
  handleCreateInvoice,
  printInvoice,
  setInvoiceColor,
} from "../OrderActions";

// MUI components
import { Box, Button, Stack, Typography } from "@mui/material";

// MUI icons
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

// Invoice detail item
const InvoiceItem = memo(({ name, value, id, color = "auto" }) => (
  <Typography paragraph id={`invoice.${id}`}>
    {`${name}: `}
    <Box component="span" fontWeight="bold" color={color}>
      {value}
    </Box>
  </Typography>
));

const InvoiceSection = forwardRef(
  ({ data, reload, checkAuthentication }, ref) => {
    const authApi = useAuthApi();

    const dispatch = useContext(SnackbarContext);
    const dataName = "invoice";

    const onCreateInvoice = useCallback(async () => {
      const submitData = {
        // Leave order data untouched
        id: data?.id,
        customerId: data?.customerId,
        // Correctly format products
        products: data?.products?.map((product) => ({
          id: product.productId,
          quantity: product.quantity,
        })),
        // Set invoice as true
        invoice: true,
      };
      const response = await handleCreateInvoice(submitData);

      if (response?.length) {
        // Display confirmation message if the request was successful
        dispatch({
          type: SNACKBAR_ACTIONS.CREATE,
          payload: response,
          dataName,
        });
        // Force refetch to get updated data
        reload();
      } else {
        console.error(response);
        // Display a generic error message
        dispatch({
          type: SNACKBAR_ACTIONS.CREATE_ERROR,
          payload: response,
          dataName,
        });
      }
    }, [data, dispatch, reload]);

    const handleEditInvoice = useCallback(
      async (invoiceId, paid) => {
        try {
          const response = await authApi.put(`invoices/${invoiceId}`, {
            paid,
          });

          // Return invoice name to display on edit confirmation message
          return `Invoice ${response.data?.id}`;
        } catch (err) {
          return err?.response;
        }
      },
      [authApi]
    );

    const onEditInvoice = useCallback(async () => {
      const needsLogin = await checkAuthentication("edit");

      // Restrict delete invoice to authenticated users
      if (!needsLogin) {
        const response = await handleEditInvoice(data?.invoice?.id, true);

        if (response?.length) {
          // Display confirmation message if the request was successful
          dispatch({
            type: SNACKBAR_ACTIONS.EDIT,
            payload: response,
            dataName,
          });
          // Force refetch to get updated data
          reload();
          return;
        } else {
          console.error(response);
          // Display a generic error message
          dispatch({
            type: SNACKBAR_ACTIONS.EDIT_ERROR,
            payload: response,
            dataName,
          });
        }
      }

      return;
    }, [
      checkAuthentication,
      handleEditInvoice,
      data?.invoice?.id,
      dispatch,
      reload,
    ]);

    const onPrintInvoice = useCallback(async () => {
      const needsLogin = await checkAuthentication("print");

      // Restrict printing invoice to authenticated users
      if (!needsLogin) {
        printInvoice(ref.current, data?.invoice?.idNumber);
      }

      return;
    }, [checkAuthentication, data?.invoice?.idNumber, ref]);

    const handleDeleteInvoice = useCallback(
      async (invoiceId) => {
        try {
          const response = await authApi.delete(`invoices/${invoiceId}`);

          // Return invoice name to display on delete confirmation message
          return `Invoice ${response.data?.id}`;
        } catch (err) {
          return err?.response;
        }
      },
      [authApi]
    );

    const onDeleteInvoice = useCallback(async () => {
      const needsLogin = await checkAuthentication("delete");

      // Restrict marking invoice as paid to authenticated users
      if (!needsLogin) {
        const response = await handleDeleteInvoice(data?.invoice?.id);

        if (response?.length) {
          // Display confirmation message if the request was successful
          dispatch({
            type: SNACKBAR_ACTIONS.DELETE,
            payload: response,
            dataName,
          });
          // Force refetch to get updated data
          reload();
        } else {
          console.error(response);
          // Display a generic error message
          dispatch({
            type: SNACKBAR_ACTIONS.DELETE_ERROR,
            payload: response,
            dataName,
          });
        }
      }

      return;
    }, [
      checkAuthentication,
      handleDeleteInvoice,
      data?.invoice?.id,
      dispatch,
      reload,
    ]);

    return (
      <Box>
        <Typography variant="h5" mb={4}>
          Invoice
        </Typography>
        {data?.invoice ? (
          <>
            <InvoiceItem name="ID" value={data?.invoice?.id} id="id" />
            <InvoiceItem
              name="Due"
              value={formatOrderDate(data?.invoice?.paymentDue)}
              id="dueDate"
            />
            <InvoiceItem
              name="Status"
              value={getInvoiceStatus(data?.invoice)}
              color={setInvoiceColor(data?.invoice)}
              id="dueDate"
            />
            <Box width="14rem">
              {!data?.invoice?.paid && (
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={onEditInvoice}
                  endIcon={<CheckIcon />}
                  sx={{
                    mb: 1.5,
                    "&, & .MuiButtonBase-root": { alignItems: "normal" },
                  }}
                  fullWidth
                >
                  Mark as paid
                </Button>
              )}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onPrintInvoice}
                  endIcon={<PrintIcon />}
                  sx={{
                    "&, & .MuiButtonBase-root": { alignItems: "normal" },
                  }}
                  fullWidth
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={onDeleteInvoice}
                  endIcon={<DeleteIcon />}
                  sx={{
                    "&, & .MuiButtonBase-root": { alignItems: "normal" },
                  }}
                  fullWidth
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </>
        ) : (
          <>
            <Typography mb={2}>No invoice for this order.</Typography>
            <Button variant="outlined" onClick={onCreateInvoice}>
              Generate invoice
            </Button>
          </>
        )}
      </Box>
    );
  }
);

export default InvoiceSection;
