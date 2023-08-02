import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

// Project import
import useFetch from "../../hooks/useFetch";
import useRandomOrderData from "../../hooks/useRandomOrderData";
import { getSubmitData } from "./OrderActions";
import validationRules from "../../utils/formValidation";

// MUI import
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  capitalize,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const OrdersDrawer = (props) => {
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

  // Filter Drawer fields based on property `fieldFormat.exclude`
  const filterFields = useCallback(
    (fields) => {
      return props.edit
        ? fields?.filter((item) => !item.column.columnDef?.fieldFormat?.exclude)
        : fields?.filter((column) => !column.columnDef?.fieldFormat?.exclude);
    },
    [props.edit]
  );

  const { register, control, handleSubmit, reset, formState, setValue, watch } =
    useForm({
      defaultValues: { customer: null, products: [], invoice: false },
    });

  // Products array
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "products",
    rules: {
      required: "Please, add at least one product",
    },
  });

  const onSubmit = useCallback(
    (formData) => {
      // Process form data for submit
      const submitData = getSubmitData(formData);

      props.onSubmit(submitData);

      // Reset form and remove all product fields on submit
      reset();
      remove();
    },
    [props, remove, reset]
  );

  // Reset the form on submit/close
  useEffect(() => {
    if (!props.drawerOpen) {
      reset();
      remove();
    }
  }, [props.drawerOpen, remove, reset]);

  // Populate the form on edit
  useEffect(() => {
    if (props.drawerOpen && props.edit) {
      // Get order customer
      const defaultCustomer = props.itemData
        .filter((item) => item.id.split("_")[1] === "customer")[0]
        .getValue();
      setValue("customer", defaultCustomer);

      // Get order products
      const defaultProducts = props.itemData
        .filter((item) => item.id.split("_")[1] === "products")[0]
        .getValue()
        .map((product) => ({
          product: productsData?.find((item) => item.id === product.productId),
          quantity: product.quantity,
        }));
      replace("products", defaultProducts);

      // Populate form fields
      reset(
        {
          customer: defaultCustomer,
          products: defaultProducts,
        },
        { keepDefaultValues: true }
      );
    }
  }, [
    productsData,
    props.drawerOpen,
    props.edit,
    props.itemData,
    replace,
    reset,
    setValue,
  ]);

  // Reload state to trigger new random data fetch
  const [reload, setReload] = useState();

  // Get random data
  const { loading, data: randomData } = useRandomOrderData(
    productsData,
    customerData,
    reload
  );

  // Set random order data
  const setRandomData = useCallback(() => {
    // Trigger new random data fetch
    setReload({});

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

  // Create new-order-form fields based on row data
  const createFormFields = !props.edit
    ? filterFields(props.itemData)?.map((column, index) => {
        switch (column.columnDef?.accessorKey) {
          case "customer":
            return (
              <Controller
                key={index}
                control={control}
                name={column.columnDef.accessorKey}
                rules={validationRules(column.columnDef)}
                render={({ field }) => (
                  <Autocomplete
                    handleHomeEndKeys
                    id={`${props.dataName.singular}-${column.columnDef.accessorKey}`}
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id={column.columnDef.accessorKey}
                        label={column.columnDef.header()}
                        error={
                          !!(
                            formState.errors[column.columnDef.accessorKey] ||
                            customerError
                          )
                        }
                        helperText={
                          (formState.errors[column.columnDef.accessorKey] &&
                            formState.errors[column.columnDef.accessorKey]
                              ?.message) ||
                          customerError?.message
                        }
                        InputLabelProps={{ shrink: true }}
                        disabled={
                          formState.isLoading ||
                          formState.isSubmitting ||
                          loading ||
                          customerLoading
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {formState.isLoading ||
                              formState.isSubmitting ||
                              loading ||
                              customerLoading ? (
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
                          id={`products-${prodIndex}.product`}
                          value={watch("products")[prodIndex].product || null}
                          onChange={(event, value) => {
                            field.onChange(value);
                          }}
                          options={productsData ?? []}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          getOptionLabel={(product) =>
                            `${product?.id && "#" + product.id} ${
                              product?.title
                            }`
                          }
                          noOptionsText={"No products"}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id={`products.${prodIndex}.product-input`}
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
                                productsLoading
                              }
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {formState.isLoading ||
                                    formState.isSubmitting ||
                                    loading ||
                                    customerLoading ? (
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
                            label={`Qty. #${prodIndex + 1}`}
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
                              productsLoading
                            }
                            InputProps={{
                              // Set minimum quantity as 1
                              inputProps: { min: 1 },
                              endAdornment: (
                                <>
                                  {formState.isLoading ||
                                  formState.isSubmitting ||
                                  loading ||
                                  customerLoading ? (
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
                    <Tooltip title="Delete" onClick={() => remove(prodIndex)}>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
                <Typography color="error.main" variant="caption">
                  {formState.errors.products?.root?.message}
                </Typography>
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={() => append({ product: "", quantity: 1 })}
                  sx={{ mt: 1 }}
                >
                  Add Product
                </Button>
              </Stack>
            );
          case "invoice":
            return (
              <FormControlLabel
                key={index}
                label="Generate invoice"
                sx={{ width: "100%", mt: "1.5rem" }}
                control={
                  <Controller
                    control={control}
                    id={column.columnDef.accessorKey}
                    name={column.columnDef.accessorKey}
                    rules={validationRules(column.columnDef)}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={!!field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                }
              />
            );
          default:
            return null;
        }
      })
    : null;

  // Create edit-order-form fields based on row data
  const editFormFields = props.edit
    ? filterFields(props.itemData)?.map((item, index) => {
        switch (item.column.columnDef?.accessorKey) {
          case "id":
            return (
              <Controller
                key={index}
                control={control}
                name={item.column.columnDef.accessorKey}
                defaultValue={item?.getValue()}
                rules={validationRules(item.column.columnDef)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={item.column.columnDef.accessorKey}
                    label={item.column.columnDef.header()}
                    type="string"
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    disabled={
                      formState.isLoading || formState.isSubmitting || loading
                    }
                    sx={{ display: "none" }}
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
                name={item.column.columnDef.accessorKey}
                rules={validationRules(item.column.columnDef)}
                render={({ field }) => (
                  <Autocomplete
                    handleHomeEndKeys
                    id={`${props.dataName.singular}-${item.column.columnDef.accessorKey}`}
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id={item.column.columnDef.accessorKey}
                        label={item.column.columnDef.header()}
                        error={
                          !!(
                            formState.errors[
                              item.column.columnDef.accessorKey
                            ] || customerError
                          )
                        }
                        helperText={
                          (formState.errors[
                            item.column.columnDef.accessorKey
                          ] &&
                            formState.errors[item.column.columnDef.accessorKey]
                              ?.message) ||
                          customerError?.message
                        }
                        InputLabelProps={{ shrink: true }}
                        disabled={
                          formState.isLoading ||
                          formState.isSubmitting ||
                          loading ||
                          customerLoading
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {formState.isLoading ||
                              formState.isSubmitting ||
                              loading ||
                              customerLoading ? (
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
                                productsLoading
                              }
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {formState.isLoading ||
                                    formState.isSubmitting ||
                                    loading ||
                                    customerLoading ? (
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
                              productsLoading
                            }
                            InputProps={{
                              // Set minimum quantity as 1
                              inputProps: { min: 1 },
                              endAdornment: (
                                <>
                                  {formState.isLoading ||
                                  formState.isSubmitting ||
                                  loading ||
                                  customerLoading ? (
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
                    <Tooltip title="Delete" onClick={() => remove(prodIndex)}>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
                <Typography color="error.main" variant="caption">
                  {formState.errors.products?.root?.message}
                </Typography>
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={() => append({ product: "", quantity: 1 })}
                  sx={{ mt: 1 }}
                >
                  Add Product
                </Button>
              </Stack>
            );
          case "invoice":
            // Only display the checkbox if no invoice exists for current order
            return !!item.getValue() ? null : (
              <FormControlLabel
                key={index}
                label="Generate invoice"
                sx={{ width: "100%", mt: "1.5rem" }}
                control={
                  <Controller
                    control={control}
                    id={item.column.columnDef.accessorKey}
                    name={item.column.columnDef.accessorKey}
                    rules={validationRules(item.column.columnDef)}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={!!field.value}
                        onChange={field.onChange}
                        disabled={
                          formState.isLoading ||
                          formState.isSubmitting ||
                          loading
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
      })
    : null;

  return (
    <Drawer
      anchor="right"
      open={props.drawerOpen || false}
      onClose={props.onClose}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: "28rem" },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
        <Typography variant="h4" mb={6}>
          {`${props.edit ? "Edit" : "New"} ${
            props.dataName ? capitalize(props?.dataName?.singular) : "Item"
          }`}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={setRandomData}
          disabled={formState.isLoading || formState.isSubmitting || loading}
          endIcon={
            (formState.isLoading || formState.isSubmitting || loading) && (
              <CircularProgress color="inherit" size={20} />
            )
          }
          sx={{ mb: 3, ml: "auto", height: "fit-content" }}
        >
          Fill With Random Data
        </Button>
        <form onSubmit={handleSubmit(onSubmit)}>
          {(createFormFields || editFormFields) ?? (
            <Alert severity="info">
              <AlertTitle>No Data</AlertTitle>
              {`The ${
                props?.dataName?.singular ?? "item"
              } you selected contains no data.`}
            </Alert>
          )}
          <Button
            variant="contained"
            type="submit"
            disabled={
              (!createFormFields?.length && !editFormFields?.length) ||
              formState.isLoading ||
              formState.isSubmitting ||
              loading
            }
            endIcon={
              (formState.isLoading || formState.isSubmitting || loading) && (
                <CircularProgress color="inherit" size={20} />
              )
            }
            sx={{ mt: 4 }}
          >
            {`${
              props.edit
                ? "Save Edits"
                : "Add " + (props?.dataName?.singular ?? "item")
            }`}
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};

OrdersDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
  itemData: PropTypes.array,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  dataName: PropTypes.object,
};

export default OrdersDrawer;
