import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

// Project import
import useFetch from "../../hooks/useFetch";
import validationRules from "../../utils/formValidation";
import getRandomInt from "../../utils/getRandomInt";

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
  // Fetch customer data
  const {
    loading: customerLoading,
    error: customerError,
    data: customerData,
  } = useFetch("http://localhost:4000/api/v1/customers");

  // Fetch product data
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useFetch("http://localhost:4000/api/v1/products");

  // Filter Drawer fields based on property `fieldFormat.exclude`
  const filterFields = useCallback(
    (fields) => {
      return props.edit
        ? fields?.filter((item) => !item.column.columnDef?.fieldFormat?.exclude)
        : fields?.filter((column) => !column.columnDef?.fieldFormat?.exclude);
    },
    [props.edit]
  );

  // Customer field value
  const [customerValue, setCustomerValue] = useState();

  // Products field list of values
  const [productsValue, setProductsValue] = useState();

  const { register, control, handleSubmit, reset, formState } = useForm();

  // Products array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
    rules: {
      required: "Please, add at least one product",
    },
  });

  // Loading state for setRandomData
  const [loading, setLoading] = useState(false);

  // Get id from formData item
  const getItemId = useCallback(
    (item) => parseInt(item.split(" ")[0].substring(1)),
    []
  );

  const onSubmit = useCallback(
    (formData) => {
      // Process form data for submit
      const submitData = {
        // Pass `id` property if available
        ...(formData.id && { id: parseInt(formData.id) }),
        customerId: getItemId(formData.customer),
        products: formData.products.map((product) => ({
          id: getItemId(product.product),
          quantity: parseInt(product.quantity),
        })),
        //
        invoice: !!formData.invoice,
      };
      props.onSubmit(submitData);
      // Reset form and remove all product fields on submit
      reset();
      setCustomerValue();
      setProductsValue();
      fields.forEach((field) => remove());
    },
    [fields, getItemId, props, remove, reset]
  );

  // Reset the form on submit/close
  useEffect(() => {
    if (!props.drawerOpen) {
      reset();
      setCustomerValue();
      setProductsValue();
      fields.forEach((field) => remove());
    }
  }, [fields, props.drawerOpen, remove, reset]);

  // Populate the form on edit
  useEffect(() => {
    if (props.drawerOpen && props.edit) {
      // Get order customer
      const defaultCustomer = props.itemData
        .filter((item) => item.id.split("_")[1] === "customer")[0]
        .getValue();

      // Get order products
      setCustomerValue(defaultCustomer);
      const defaultProducts = props.itemData
        .filter((item) => item.id.split("_")[1] === "products")[0]
        .getValue()
        .map((product) => ({
          product: productsData.find((item) => item.id === product.productId),
          quantity: product.quantity,
        }));
      setProductsValue(defaultProducts.map((product) => product.product));

      // Populate form fields
      reset(
        {
          customer: defaultCustomer,
          products: defaultProducts,
        },
        { keepDefaultValues: true }
      );
    }
  }, [productsData, props.drawerOpen, props.edit, props.itemData, reset]);

  // Fill with random data
  const setRandomData = useCallback(async () => {
    // Get an array of random products
    const allProducts = [...productsData];
    const randomProductsCount = getRandomInt(3);
    const getUniqueId = () => {
      const removedId = allProducts?.splice(
        getRandomInt(allProducts?.length - 1, 0),
        1
      )[0];
      return removedId;
    };
    const randomProducts = [];
    let i = 0;
    while (i < randomProductsCount) {
      randomProducts.push({
        product: getUniqueId(),
        quantity: getRandomInt(3),
      });
      i++;
    }
    setProductsValue(randomProducts.map((product) => product.product));

    // Get a random customer
    const randomCustomer = () => {
      const randomInt = getRandomInt(customerData?.length - 1);
      setCustomerValue(customerData?.[randomInt]);
    };

    // Get a random boolean value for the invoice
    const randomBoolean = Boolean(getRandomInt(2, 0));

    // Disable "Fill with random data" button
    setLoading(true);

    // Fill form fields
    reset({
      customer: randomCustomer(),
      products: randomProducts,
      invoice: randomBoolean,
    });

    setLoading(false);
  }, [customerData, productsData, reset]);

  // Delete item from products list
  const deleteProduct = useCallback(
    (index) => {
      const newProducts = productsValue.filter(
        (product) => productsValue.indexOf(product) !== index
      );
      setProductsValue(newProducts);
      remove(index);
    },
    [productsValue, remove]
  );

  // Create new-item-form fields based on row data
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
                    value={customerValue || null}
                    options={customerData ?? []}
                    getOptionLabel={(customer) =>
                      `${customer?.id && "#" + customer.id} ${
                        customer?.firstName
                      } ${customer?.lastName}`
                    }
                    onInputChange={(event, item) => {
                      if (item) field.onChange(item);
                    }}
                    noOptionsText={`No ${props?.dataName?.plural ?? "items"}`}
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
                  <Stack key={prodIndex} direction="row" spacing={2} useFlexGap>
                    <Controller
                      control={control}
                      name={`products.${prodIndex}.product`}
                      render={({ field }) => (
                        <Autocomplete
                          handleHomeEndKeys
                          {...register(`products.${prodIndex}.product`, {
                            required: "Please, select a product",
                          })}
                          id={`${props.dataName.singular}-products-${prodIndex}`}
                          value={productsValue?.[prodIndex] || null}
                          options={productsData ?? []}
                          getOptionLabel={(product) =>
                            `${product?.id && "#" + product.id} ${
                              product?.title
                            }`
                          }
                          noOptionsText={`No ${
                            props?.dataName?.plural ?? "items"
                          }`}
                          onInputChange={(event, item) => {
                            if (item) field.onChange(item);
                          }}
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
                                message: "Must be >0",
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
                            sx={{ maxWidth: "6.7rem" }}
                          />
                        </FormControl>
                      )}
                    />
                    <Tooltip
                      title="Delete"
                      onClick={() => deleteProduct(prodIndex)}
                    >
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

  // Create edit-item-form fields based on row data
  const editFormFields = props.edit
    ? filterFields(props.itemData)?.map((item, index) => {
        switch (item.column.columnDef?.accessorKey) {
          case "id":
            return (
              <Controller
                key={index}
                control={control}
                name={item.column.columnDef.accessorKey}
                defaultValue={item.getValue()}
                rules={validationRules(item.column.columnDef)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={item.column.columnDef.accessorKey}
                    label={item.column.columnDef.header()}
                    inputRef={field.ref}
                    type="text"
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
                    value={customerValue || null}
                    options={customerData ?? []}
                    getOptionLabel={(customer) =>
                      `${customer?.id && "#" + customer.id} ${
                        customer?.firstName
                      } ${customer?.lastName}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onInputChange={(event, item) => {
                      if (item) field.onChange(item);
                    }}
                    noOptionsText={`No ${props?.dataName?.plural ?? "items"}`}
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
                  <Stack key={prodIndex} direction="row" spacing={2} useFlexGap>
                    <Controller
                      control={control}
                      name={`products.${prodIndex}.product`}
                      render={({ field }) => (
                        <Autocomplete
                          handleHomeEndKeys
                          {...register(`products.${prodIndex}.product`, {
                            required: "Please, select a product",
                          })}
                          id={`${props.dataName.singular}-products-${prodIndex}`}
                          value={productsValue?.[prodIndex] || null}
                          options={productsData ?? []}
                          getOptionLabel={(product) =>
                            `${product?.id && "#" + product.id} ${
                              product?.title
                            }`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          noOptionsText={`No ${
                            props?.dataName?.plural ?? "items"
                          }`}
                          onInputChange={(event, item) => {
                            if (item) field.onChange(item);
                          }}
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
                                message: "Must be >0",
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
                            sx={{ maxWidth: "6.7rem" }}
                          />
                        </FormControl>
                      )}
                    />
                    <Tooltip
                      title="Delete"
                      onClick={() => deleteProduct(prodIndex)}
                    >
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
            // Only display the checkbox if the invoice does not exist
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
          }`}{" "}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={setRandomData}
          disabled={loading}
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
  randomData: PropTypes.object,
};

export default OrdersDrawer;
