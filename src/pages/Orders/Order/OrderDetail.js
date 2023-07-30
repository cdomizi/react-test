import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

// Project import
import useFetch from "../../../hooks/useFetch";
import useRandomOrderData from "../../../hooks/useRandomOrderData";
import {
  handleEditOrder,
  getInvoiceStatus,
  setInvoiceColor,
} from "../OrderActions";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import CustomSnackbar from "../../../components/CustomSnackbar";
import { formatLabel, formatOrderDate } from "../../../utils/formatStrings";

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
} from "@mui/icons-material";

const OrderDetail = ({ loading, error, data, dataName, reload = null }) => {
  const [edit, setEdit] = useState(false);

  // State and dispatch function for snackbar component
  const [snackbarState, dispatch] = useContext(SnackbarContext);

  // Set the `dataName` property for the snackbar
  snackbarState.dataName = dataName?.singular;

  const { register, control, handleSubmit, reset, formState, watch } = useForm({
    defaultValues: {
      customer: data?.customerId,
      products: data?.products,
      invoice: !!data?.invoice,
    },
  });

  // Products array
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "products",
    rules: {
      required: "Please, add at least one product",
    },
  });

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

  useEffect(
    () => console.log("hook", randomData?.products?.[0]?.product?.id),
    [randomData]
  );
  useEffect(() => console.log("fields", fields?.[0]?.product?.id), [fields]);

  const OrderSkeleton = useMemo(
    () => (
      <>
        <Skeleton
          variant="text"
          sx={{ fontSize: "5rem", maxWidth: "26rem", marginBottom: "2rem" }}
        />
        <Stack direction="row" spacing={2}>
          <Stack width="20rem">
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
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
  }, [data, productsData, replace, reset]);

  // Order details section
  const FormDetails = useMemo(
    () =>
      data &&
      Object.keys(data)?.map((key, index) => {
        switch (key) {
          case "id":
          case "createdAt":
          case "updatedAt":
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
                <Divider>
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

  // Invoice section
  const OrderInvoice = useMemo(
    () => (
      <Box>
        <Typography variant="h5" mb={4}>
          Invoice
        </Typography>
        {data?.invoice ? (
          <>
            <Typography paragraph>
              Due:{" "}
              <Box component="span" fontWeight="bold">
                {`${formatOrderDate(data?.paymentDue)}`}
              </Box>
            </Typography>
            <Typography paragraph>
              Status:{" "}
              <Box
                component="span"
                fontWeight="bold"
                color={setInvoiceColor(data?.invoice)}
              >{`${getInvoiceStatus(data?.invoice)}`}</Box>
            </Typography>
            <Stack direction="row" spacing={2} width="22rem">
              {!data?.invoice?.paid && (
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  endIcon={<CheckIcon />}
                  fullWidth
                  sx={{
                    "&, & .MuiButtonBase-root": { alignItems: "normal" },
                  }}
                >
                  Mark as paid
                </Button>
              )}
              <Button
                variant="outlined"
                color="error"
                size="small"
                endIcon={<DeleteIcon />}
                fullWidth={!data?.invoice?.paid}
                sx={{
                  "&, & .MuiButtonBase-root": { alignItems: "normal" },
                }}
              >
                Delete invoice
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography mb={2}>No invoice for this order.</Typography>
            <Button variant="outlined">Generate invoice</Button>
          </>
        )}
        {data && (
          <pre>
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        )}
      </Box>
    ),
    [data]
  );

  return loading ? (
    OrderSkeleton
  ) : (
    <Box>
      <Typography variant="h2" mb="3rem">{`Order #${data?.id}`}</Typography>
      <Stack direction="row" spacing="2rem">
        <form onSubmit={null}>
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
              <>
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
                >
                  Fill with random data
                </Button>
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
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
                    Undo
                  </Button>
                </Stack>
              </>
            ) : (
              <Button
                type="button"
                variant="outlined"
                size="large"
                fullWidth
                endIcon={<EditIcon />}
                onClick={(event) => {
                  event.preventDefault();
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
        <Divider orientation="vertical" flexItem />
        {(!error && OrderInvoice) ?? null}
      </Stack>
      <CustomSnackbar {...snackbarState} />
    </Box>
  );
};

export default OrderDetail;
