import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

// Project import
import useFetch from "../../hooks/useFetch";
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

  // Fetch invoice data
  const {
    // loading: invoiceLoading,
    // error: invoiceError,
    data: invoiceData,
  } = useFetch("http://localhost:4000/api/v1/invoices");

  // Filter Drawer fields based on property `fieldFormat.exclude`
  const filterFields = useCallback(
    (fields) => {
      return props.edit
        ? fields?.filter((item) => !item.column.columnDef?.fieldFormat?.exclude)
        : fields?.filter((column) => !column.columnDef?.fieldFormat?.exclude);
    },
    [props.edit]
  );

  const defaultValues = useMemo(() => props.itemData, [props.itemData]);
  const { register, control, handleSubmit, reset, formState } = useForm({
    // defaultValues,
  });

  // Products array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
    rules: {
      required: "Please, add at least one product",
    },
  });

  // State to force reload on Drawer component
  const [reload, setReload] = useState();

  // Loading state for setRandomData
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    (formData) => {
      props.onSubmit(formData);
      reset();
      // Remove all product form fields on submit
      fields.forEach((field) => remove());
    },
    [fields, props, remove, reset]
  );

  // Reset the form on submit/close
  useEffect(() => {
    if (!props.drawerOpen) {
      reset(props.itemData);
      fields.forEach((field) => remove());
    }
  }, [fields, props.drawerOpen, props.itemData, remove, reset]);

  // Fill with random data
  const setRandomData = useCallback(async () => {
    const randomItemId = Math.ceil(Math.random() * props.randomData.maxCount);
    try {
      // Disable "Fill with random data" button
      setLoading(true);
      const response = await fetch(
        `${props.randomData.url}/${randomItemId}`,
        {}
      );
      const randomItemData = await response.json();

      if (response.ok) {
        // Delete ID property if exists
        randomItemData.id && delete randomItemData.id;
        reset(randomItemData, { keepDefaultValues: true });
        setReload({});
      }
    } catch (error) {
      throw new Error(error?.message);
    } finally {
      setLoading(false);
    }
  }, [props.randomData, reset]);

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
                defaultValue={""}
                rules={validationRules(column.columnDef)}
                render={({ field }) => (
                  <Autocomplete
                    handleHomeEndKeys
                    id={`${props.dataName}-${column.columnDef.accessorKey}`}
                    options={customerData}
                    getOptionLabel={(customer) =>
                      `#${customer?.id} ${customer?.firstName} ${customer?.lastName}`
                    }
                    onChange={(event, value) => field.onChange(value)}
                    onInputChange={(event, item) => {
                      if (item) field.onChange(item);
                    }}
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
                          ...((formState.isLoading ||
                            formState.isSubmitting ||
                            loading ||
                            customerLoading) && {
                            endAdornment: (
                              <InputAdornment position="end">
                                <CircularProgress color="inherit" size={20} />
                              </InputAdornment>
                            ),
                          }),
                        }}
                        margin="normal"
                        fullWidth
                      />
                    )}
                    sx={{
                      maxHeight: "10rem",
                      overflow: "auto",
                    }}
                  />
                )}
              />
            );
          case "products":
            return (
              <Stack key={index} mt={3}>
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
                          id={`${props.dataName}-products-${prodIndex}`}
                          onChange={(event, value) => field.onChange(value)}
                          onInputChange={(event, item) => {
                            if (item) field.onChange(item);
                          }}
                          options={productsData}
                          getOptionLabel={(product) =>
                            `#${product?.id} ${product?.title}`
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id={`products.${prodIndex}.product`}
                              label="Product"
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
                                ...((formState.isLoading ||
                                  formState.isSubmitting ||
                                  loading ||
                                  productsLoading) && {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    </InputAdornment>
                                  ),
                                }),
                              }}
                              margin="normal"
                              fullWidth
                            />
                          )}
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
                            label="Quantity"
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
                              min: 1,
                              ...((formState.isLoading ||
                                formState.isSubmitting ||
                                loading ||
                                productsLoading) && {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  </InputAdornment>
                                ),
                              }),
                            }}
                            sx={{ maxWidth: "6.7rem" }}
                          />
                        </FormControl>
                      )}
                    />
                    <IconButton onClick={() => remove(prodIndex)}>
                      <DeleteIcon />
                    </IconButton>
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
          // <Controller
          //   key={index}
          //   control={control}
          //   name={column.columnDef.accessorKey}
          //   rules={validationRules(column.columnDef)}
          //   render={({ field }) => (
          //     <Autocomplete
          //       multiple
          //       handleHomeEndKeys
          //       id={`${props.dataName}-${column.columnDef.accessorKey}`}
          //       onChange={(event, value) => field.onChange(value)}
          //       onInputChange={(event, item) => {
          //         if (item) field.onChange(item);
          //       }}
          //       options={productsData}
          //       getOptionLabel={(product) =>
          //         `#${product?.id} ${product?.title}`
          //       }
          //       renderInput={(params) => (
          //         <TextField
          //           {...params}
          //           id={column.columnDef.accessorKey}
          //           label={column.columnDef.header()}
          //           error={
          //             !!(
          //               formState.errors[column.columnDef.accessorKey] ||
          //               productsError
          //             )
          //           }
          //           helperText={
          //             (formState.errors[column.columnDef.accessorKey] &&
          //               formState.errors[column.columnDef.accessorKey]
          //                 ?.message) ||
          //             productsError?.message
          //           }
          //           InputLabelProps={{ shrink: true }}
          //           disabled={
          //             formState.isLoading ||
          //             formState.isSubmitting ||
          //             loading ||
          //             productsLoading
          //           }
          //           InputProps={{
          //             ...((formState.isLoading ||
          //               formState.isSubmitting ||
          //               loading ||
          //               productsLoading) && {
          //               endAdornment: (
          //                 <InputAdornment position="end">
          //                   <CircularProgress color="inherit" size={20} />
          //                 </InputAdornment>
          //               ),
          //             }),
          //           }}
          //           margin="normal"
          //           fullWidth
          //         />
          //       )}
          //       sx={{
          //         maxHeight: "10rem",
          //         overflow: "auto",
          //       }}
          //     />
          //   )}
          // />
          case "invoice":
            return (
              <Controller
                key={index}
                control={control}
                name={column.columnDef.accessorKey}
                rules={validationRules(column.columnDef)}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    control={<Checkbox />}
                    label="Generate invoice"
                    sx={{ width: "100%", mt: "3rem" }}
                  />
                )}
              />
            );
          default:
            return null;
        }
      })
    : null;

  // Create edit-item-form fields based on row data
  const editFormFields = props.edit
    ? filterFields(props.itemData)?.map((item, index) =>
        item.column.columnDef?.fieldFormat?.checkbox ? (
          <Controller
            key={index}
            control={control}
            name={item.column.columnDef.accessorKey}
            rules={validationRules(item.column.columnDef)}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox />}
                label="Generate invoice"
                sx={{ width: "100%" }}
              />
            )}
          />
        ) : (
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
                inputRef={field.ref}
                type={item.column.columnDef?.fieldFormat?.type ?? "text"}
                error={!!formState.errors[item.column.columnDef.accessorKey]}
                helperText={
                  formState.errors[item.column.columnDef.accessorKey] &&
                  formState.errors[item.column.columnDef.accessorKey]?.message
                }
                InputProps={
                  item.column.columnDef?.fieldFormat?.format === "money"
                    ? {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }
                    : item.column.columnDef?.fieldFormat?.format ===
                      "percentage"
                    ? {
                        endAdornment: (
                          <InputAdornment position="start">%</InputAdornment>
                        ),
                      }
                    : null
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
                disabled={
                  formState.isLoading || formState.isSubmitting || loading
                }
                sx={{
                  display: item.column.columnDef?.fieldFormat?.hidden
                    ? "none"
                    : "inherit",
                }}
                fullWidth
              />
            )}
          />
        )
      )
    : null;

  return (
    <Drawer
      anchor="right"
      open={props.drawerOpen || false}
      onClose={props.onClose}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: "28rem" },
      }}
      reload={reload}
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
