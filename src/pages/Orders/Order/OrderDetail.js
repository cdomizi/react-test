import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

// Project import
import useFetch from "../../../hooks/useFetch";
import useRandomOrderData from "../../../hooks/useRandomOrderData";
import {
  handleEditOrder,
  getInvoiceStatus,
  setInvoiceColor,
  getSubmitData,
  handleCreateInvoice,
  printInvoice,
} from "../OrderActions";
import useAuthApi from "../../../hooks/useAuthApi";
import AuthContext from "../../../contexts/AuthContext";
import useRefreshToken from "../../../hooks/useRefreshToken";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import CustomSnackbar from "../../../components/CustomSnackbar";
import DialogContext, { DIALOG_ACTIONS } from "../../../contexts/DialogContext";
import { formatLabel, formatOrderDate } from "../../../utils/formatStrings";
import InvoiceTemplate from "./InvoiceTemplate";
import CustomDivider from "../../../components/CustomDivider";

// Mui components
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

// MUI icons
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

const OrderDetail = ({ loading, error, data, dataName, reload = null }) => {
  const [edit, setEdit] = useState(false);

  // Ref for the invoice template
  const invoiceTemplateRef = useRef(null);

  // Set up snackbar
  const { snackbarState, dispatch: snackbarDispatch } =
    useContext(SnackbarContext);
  snackbarState.dataName = dataName?.singular;

  const dialogDispatch = useContext(DialogContext);

  const { auth } = useContext(AuthContext);
  const refreshToken = useRefreshToken();
  const authApi = useAuthApi();

  const navigate = useNavigate();
  const location = useLocation();

  const defaultValues = useMemo(
    () => ({
      customer: data?.customerId,
      products: data?.products,
      invoice: !!data?.invoice,
    }),
    [data?.customerId, data?.invoice, data?.products]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    getValues,
    watch,
  } = useForm({ defaultValues });

  // Products array
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "products",
    rules: {
      required: "Please, add at least one product",
    },
  });

  const onSubmit = useCallback(
    async (formData) => {
      // Process form data for submit
      const submitData = getSubmitData(formData);

      const response = await handleEditOrder(submitData);
      if (response?.length) {
        // Display confirmation message if the request was successful
        snackbarDispatch({ type: SNACKBAR_ACTIONS.EDIT, payload: response });
        // Force refetch to get updated data
        reload();
      } else {
        console.error(response);
        // Check if it's a unique field error
        response?.field
          ? // Display the specific error message
            snackbarDispatch({
              type: SNACKBAR_ACTIONS.UNIQUE_FIELD_ERROR,
              payload: response,
            })
          : // Display a generic error message
            snackbarDispatch({
              type: SNACKBAR_ACTIONS.EDIT_ERROR,
              payload: response,
            });
      }

      // Disable edit mode
      setEdit(false);
    },
    [snackbarDispatch, reload]
  );

  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  // Fetch customer data
  const {
    loading: customerLoading,
    error: customerError,
    data: customerData,
  } = useFetch(`${API_ENDPOINT}customers`);

  // Fetch product data
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useFetch(`${API_ENDPOINT}products`);

  const checkAuthentication = useCallback(
    async (actionType) => {
      if (auth?.accessToken) return false;
      else {
        try {
          // Sets a new access token if expired
          // as long as the refreshToken is valid
          await refreshToken();
        } catch (err) {
          // Set message content based on action
          const action =
            actionType === "edit"
              ? "edit"
              : actionType === "print"
              ? "print"
              : "delete";

          dialogDispatch({
            type: DIALOG_ACTIONS.OPEN,
            payload: {
              open: false,
              title: "Authentication required",
              contentText: `You need to log in to ${action} the invoice.`,
              contentForm: null,
              confirm: {
                buttonText: "Log in",
                onConfirm: () => {
                  dialogDispatch({
                    type: DIALOG_ACTIONS.CLOSE,
                  });
                  // Redirect user to login page,
                  // set sessionExpired to false to prevent displaying error message
                  navigate("/login", {
                    state: { from: location, sessionExpired: false },
                  });
                },
              },
              cancel: true,
            },
          });

          return true;
        }
      }
    },
    [auth?.accessToken, dialogDispatch, location, navigate, refreshToken]
  );

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
      snackbarDispatch({
        type: SNACKBAR_ACTIONS.CREATE,
        payload: response,
        dataName: "invoice",
      });
      // Force refetch to get updated data
      reload();
    } else {
      console.error(response);
      // Display a generic error message
      snackbarDispatch({
        type: SNACKBAR_ACTIONS.CREATE_ERROR,
        payload: response,
        dataName: "invoice",
      });
    }
  }, [data, snackbarDispatch, reload]);

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
        snackbarDispatch({
          type: SNACKBAR_ACTIONS.EDIT,
          payload: response,
          dataName: "invoice",
        });
        // Force refetch to get updated data
        reload();
        return;
      } else {
        console.error(response);
        // Display a generic error message
        snackbarDispatch({
          type: SNACKBAR_ACTIONS.EDIT_ERROR,
          payload: response,
          dataName: "invoice",
        });
      }
    }

    return;
  }, [
    checkAuthentication,
    handleEditInvoice,
    data?.invoice?.id,
    snackbarDispatch,
    reload,
  ]);

  const onPrintInvoice = useCallback(async () => {
    const needsLogin = await checkAuthentication("print");

    // Restrict printing invoice to authenticated users
    if (!needsLogin) {
      printInvoice(invoiceTemplateRef.current, data?.invoice?.idNumber);
    }

    return;
  }, [checkAuthentication, data?.invoice?.idNumber]);

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
        snackbarDispatch({
          type: SNACKBAR_ACTIONS.DELETE,
          payload: response,
          dataName: "invoice",
        });
        // Force refetch to get updated data
        reload();
      } else {
        console.error(response);
        // Display a generic error message
        snackbarDispatch({
          type: SNACKBAR_ACTIONS.DELETE_ERROR,
          payload: response,
          dataName: "invoice",
        });
      }
    }

    return;
  }, [
    checkAuthentication,
    handleDeleteInvoice,
    data?.invoice?.id,
    snackbarDispatch,
    reload,
  ]);

  // Reload state to trigger new random data fetch
  const [randomReload, setRandomReload] = useState();

  // Get random data
  const { loading: randomLoading, data: randomData } = useRandomOrderData(
    productsData,
    customerData,
    randomReload
  );

  // Set random order data
  const setRandomData = useCallback(() => {
    // Trigger new random data fetch
    setRandomReload({});

    // Fill form fields with random data
    reset(
      {
        customer: randomData?.customer,
        products: randomData?.products,
        invoice: randomData?.invoice,
      },
      { keepDefaultValues: true }
    );
  }, [randomData, reset]);

  const OrderSkeleton = useMemo(
    () => (
      <>
        <Skeleton
          variant="text"
          sx={{ fontSize: "5rem", maxWidth: "16rem", marginBottom: "2rem" }}
        />
        <Stack direction="row" spacing={6}>
          <Stack width="24rem">
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", width: "24rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", width: "24rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", width: "24rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", width: "24rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "7rem" }}
            />
          </Stack>
          <Stack width="20rem" spacing={2}>
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "12rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
          </Stack>
        </Stack>
      </>
    ),
    []
  );

  // Populate the products section on page load
  useEffect(() => {
    if (data?.products?.length) {
      const defaultProducts = data?.products.map((product) => ({
        product: productsData?.find((item) => item.id === product.productId),
        quantity: product.quantity,
      }));
      replace("products", defaultProducts);
      reset({
        products: defaultProducts,
      });
    }
  }, [data, productsData, replace, reset, edit]);

  // Order details section
  const FormDetails = useMemo(
    () =>
      data &&
      Object.keys(data)?.map((key, index) => {
        switch (key) {
          case "id":
            return (
              <Controller
                key={index}
                control={control}
                name={key}
                defaultValue={data[key]}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={key}
                    label={formatLabel(key)}
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ readOnly: !edit }}
                    disabled={
                      formState.isLoading ||
                      formState.isSubmitting ||
                      loading ||
                      randomLoading
                    }
                    sx={{ display: "none" }}
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            );
          case "customer":
            return (
              <Controller
                key={index}
                control={control}
                name={key}
                defaultValue={data[key]}
                render={({ field }) => (
                  <Autocomplete
                    handleHomeEndKeys
                    id={`${dataName.singular}-${key}`}
                    value={field.value || null}
                    onChange={(event, value) => {
                      field.onChange(value);
                    }}
                    options={customerData ?? []}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(customer) =>
                      `${customer?.id && "#" + customer.id} ${
                        customer?.firstName
                      } ${customer?.lastName}`
                    }
                    noOptionsText={"No customer"}
                    readOnly={!edit}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id={key}
                        label={formatLabel(key)}
                        error={!!(formState.errors[key] || customerError)}
                        helperText={
                          (formState.errors[key] &&
                            formState.errors[key]?.message) ||
                          customerError?.message
                        }
                        InputLabelProps={{ shrink: true }}
                        disabled={
                          formState.isLoading ||
                          formState.isSubmitting ||
                          loading ||
                          customerLoading ||
                          randomLoading
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {formState.isLoading ||
                              formState.isSubmitting ||
                              loading ||
                              customerLoading ||
                              randomLoading ? (
                                <InputAdornment position="end">
                                  <CircularProgress color="inherit" size={20} />
                                </InputAdornment>
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                )}
              />
            );
          case "products":
            return (
              <Stack key={index} id="order-products-form-section" mt={3}>
                <Divider sx={{ my: 1.5 }}>
                  <Typography color="text.secondary">Products</Typography>
                </Divider>
                {fields.map((item, prodIndex) => (
                  <Stack key={item.id} direction="row" spacing={2} useFlexGap>
                    <Controller
                      control={control}
                      name={`products.${prodIndex}.product`}
                      render={({ field }) => (
                        <Autocomplete
                          handleHomeEndKeys
                          {...register(`products.${prodIndex}.product`, {
                            required: "Please, select a product",
                          })}
                          id={`products.${prodIndex}.product-input`}
                          value={watch("products")[prodIndex].product || null}
                          onChange={(event, value) => {
                            field.onChange(value);
                          }}
                          options={productsData ?? []}
                          filterOptions={(options, state) =>
                            options?.filter(
                              (product) =>
                                !watch("products").find(
                                  (selectedProduct) =>
                                    selectedProduct.product.id === product.id
                                )
                            )
                          }
                          getOptionLabel={(product) =>
                            `${product?.id && "#" + product.id} ${
                              product?.title
                            }`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          noOptionsText={"No products"}
                          readOnly={!edit}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id={`products.${prodIndex}.product`}
                              label={`Product #${prodIndex + 1}`}
                              error={
                                !!(
                                  formState.errors?.products?.[prodIndex]
                                    ?.product || productsError
                                )
                              }
                              helperText={
                                (formState.errors?.products?.[prodIndex]
                                  ?.product &&
                                  formState.errors?.products?.[prodIndex]
                                    ?.product?.message) ||
                                productsError?.message
                              }
                              InputLabelProps={{ shrink: true }}
                              disabled={
                                formState.isLoading ||
                                formState.isSubmitting ||
                                loading ||
                                productsLoading ||
                                randomLoading
                              }
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {formState.isLoading ||
                                    formState.isSubmitting ||
                                    loading ||
                                    customerLoading ||
                                    randomLoading ? (
                                      <InputAdornment position="end">
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      </InputAdornment>
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                              margin="normal"
                              fullWidth
                            />
                          )}
                          sx={{ width: "100%" }}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`products.${prodIndex}.quantity`}
                      render={({ params }) => (
                        <FormControl margin="normal">
                          <TextField
                            {...params}
                            {...register(`products.${prodIndex}.quantity`, {
                              min: {
                                value: 1,
                                valueAsNumber: true,
                                message: "Value must be >0",
                              },
                            })}
                            id={`products.${prodIndex}.quantity`}
                            label={`Quantity #${prodIndex + 1}`}
                            type="number"
                            error={
                              !!(
                                formState.errors?.products?.[prodIndex]
                                  ?.quantity || productsError
                              )
                            }
                            helperText={
                              (formState.errors?.products?.[prodIndex]
                                ?.quantity &&
                                formState.errors?.products?.[prodIndex]
                                  ?.quantity?.message) ||
                              productsError?.message
                            }
                            InputLabelProps={{ shrink: true }}
                            disabled={
                              formState.isLoading ||
                              formState.isSubmitting ||
                              loading ||
                              productsLoading ||
                              randomLoading
                            }
                            InputProps={{
                              // Set minimum quantity as 1
                              inputProps: { min: 1, readOnly: !edit },
                              endAdornment: (
                                <>
                                  {formState.isLoading ||
                                  formState.isSubmitting ||
                                  loading ||
                                  customerLoading ||
                                  randomLoading ? (
                                    <InputAdornment position="end">
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    </InputAdornment>
                                  ) : null}
                                </>
                              ),
                            }}
                            sx={{ maxWidth: "6.7rem", minWidth: "5rem" }}
                          />
                        </FormControl>
                      )}
                    />
                    <Tooltip title="Delete">
                      <>
                        <IconButton
                          sx={{ display: !!edit ? "auto" : "none" }}
                          disabled={!edit}
                          onClick={() => remove(prodIndex)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    </Tooltip>
                  </Stack>
                ))}
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={() => append({ product: "", quantity: 1 })}
                  sx={{ display: edit ? "inline-flex" : "none", mt: 1 }}
                >
                  Add Product
                </Button>
              </Stack>
            );
          case "invoice":
            // Only display the checkbox if no invoice exists for current order
            return !!data[key] ? null : (
              <FormControlLabel
                key={index}
                label="Generate invoice"
                sx={{
                  display: edit ? "inline-flex" : "none",
                  width: "100%",
                  mt: "1.5rem",
                }}
                control={
                  <Controller
                    control={control}
                    id={key}
                    name={key}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={!!field.value}
                        onChange={field.onChange}
                        disabled={
                          formState.isLoading ||
                          formState.isSubmitting ||
                          loading ||
                          randomLoading
                        }
                      />
                    )}
                  />
                }
              />
            );
          default:
            return null;
        }
      }),
    [
      append,
      control,
      customerData,
      customerError,
      customerLoading,
      data,
      dataName.singular,
      edit,
      fields,
      formState.errors,
      formState.isLoading,
      formState.isSubmitting,
      loading,
      productsData,
      productsError,
      productsLoading,
      randomLoading,
      register,
      remove,
      watch,
    ]
  );

  // Edit form
  const OrderEditForm = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} width="24rem">
        {error ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Sorry, an error occurred while getting customer's data.
          </Alert>
        ) : (
          FormDetails
        )}
        {edit ? (
          // Form actions
          <Stack spacing={2}>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={setRandomData}
              disabled={randomLoading || loading || randomLoading}
              endIcon={
                (randomLoading || loading || randomLoading) && (
                  <CircularProgress color="inherit" size={20} />
                )
              }
              fullWidth
            >
              Fill with random data
            </Button>
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Save
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                size="large"
                onClick={(event) => {
                  event.preventDefault();
                  reset();
                  setEdit(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Button
            type="button"
            variant="outlined"
            size="large"
            fullWidth
            endIcon={<EditIcon />}
            onClick={(event) => {
              event.preventDefault();
              reset();
              setEdit(true);
            }}
            sx={{
              "&, & .MuiButtonBase-root": { alignItems: "normal" },
            }}
          >
            Edit
          </Button>
        )}
      </Stack>
    </form>
  );

  // Invoice detail item
  const InvoiceItem = memo(({ name, value, id, color = "auto" }) => (
    <Typography paragraph id={`invoice.${id}`}>
      {`${name}: `}
      <Box component="span" fontWeight="bold" color={color}>
        {value}
      </Box>
    </Typography>
  ));

  // Invoice section
  const OrderInvoice = useMemo(
    () => (
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
    ),
    [
      data?.invoice,
      onCreateInvoice,
      onDeleteInvoice,
      onEditInvoice,
      onPrintInvoice,
    ]
  );

  return loading ? (
    OrderSkeleton
  ) : (
    <Box>
      <Typography variant="h2" mb="3rem">{`Order #${data?.id}`}</Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing="5rem">
        {OrderEditForm}
        <CustomDivider flexItem />
        {error ? null : OrderInvoice}
      </Stack>
      <Box display="none">
        <InvoiceTemplate
          ref={invoiceTemplateRef}
          data={{ data, products: getValues("products") }}
        />
      </Box>
      <CustomSnackbar {...snackbarState} />
    </Box>
  );
};

export default OrderDetail;
