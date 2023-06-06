import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import validationRules from "../../utils/formValidation";

import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Drawer,
  InputAdornment,
  TextField,
  Typography,
  capitalize,
} from "@mui/material";

const TableDrawer = (props) => {
  const defaultValues = useMemo(() => props.itemData, [props.itemData]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = (formData) => {
    props.onSubmit(formData);
    reset(props.itemData);
  };

  // Reset the form on submit/close
  useEffect(() => {
    if (!props.drawerOpen) reset(props.itemData);
  }, [props.drawerOpen, props.itemData, reset]);

  // Fill with random data
  const fetchRandomData = useCallback(async () => {
    const randomItemId = Math.ceil(Math.random() * props.randomData.maxCount);
    try {
      const response = await fetch(
        `${props.randomData.url}/${randomItemId}`,
        {}
      );
      const randomItemData = await response.json();

      if (response.ok) reset(randomItemData, { keepDefaultValues: true });
    } catch (error) {
      throw new Error(error?.message);
    }
  }, [props.randomData.maxCount, props.randomData.url, reset]);

  // Create new-item-form fields based on row data
  const createFormFields = useMemo(
    () =>
      !props.edit
        ? props.itemData?.map((column, index) =>
            column.columnDef?.fieldFormat?.format === "multiple" ? (
              <Controller
                key={index}
                control={control}
                name={column.columnDef.accessorKey}
                rules={validationRules(column.columnDef.accessorKey)}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    multiple
                    handleHomeEndKeys
                    id={`tags-${column.columnDef.accessorKey}`}
                    options={[]}
                    defaultValue={[]}
                    onChange={(event, value) => field.onChange(value)}
                    onInputChange={(event, item) => {
                      if (item) field.onChange(item);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id={column.columnDef.accessorKey}
                        label={column.columnDef.header()}
                        required={!!column.columnDef?.fieldFormat?.required}
                        error={errors[column.columnDef.accessorKey]}
                        helperText={
                          errors[column.columnDef.accessorKey] &&
                          errors[column.columnDef.accessorKey]?.message
                        }
                        InputLabelProps={{ shrink: true }}
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
            ) : (
              <Controller
                key={index}
                control={control}
                name={column.columnDef.accessorKey}
                defaultValue={""}
                rules={validationRules(column.columnDef.accessorKey)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={column.columnDef.accessorKey}
                    label={column.columnDef.header()}
                    inputRef={field.ref}
                    type={column.columnDef?.fieldFormat?.type ?? "text"}
                    required={!!column.columnDef?.fieldFormat?.required}
                    error={errors[column.columnDef.accessorKey]}
                    helperText={
                      errors[column.columnDef.accessorKey] &&
                      errors[column.columnDef.accessorKey]?.message
                    }
                    InputProps={
                      column.columnDef?.fieldFormat?.format === "money"
                        ? {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }
                        : column.columnDef?.fieldFormat?.format === "percentage"
                        ? {
                            endAdornment: (
                              <InputAdornment position="start">
                                %
                              </InputAdornment>
                            ),
                          }
                        : null
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      display: column.columnDef?.fieldFormat?.hidden
                        ? "none"
                        : "inherit",
                    }}
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            )
          )
        : null,
    [props.edit, props.itemData, control, errors]
  );

  // Create edit-item-form fields based on row data
  const editFormFields = useMemo(
    () =>
      props.edit
        ? props.itemData?.map((item, index) =>
            item.column.columnDef?.fieldFormat?.format === "multiple" ? (
              <Controller
                key={index}
                control={control}
                name={item.column.columnDef.accessorKey}
                rules={validationRules(item.column.columnDef.accessorKey)}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    multiple
                    handleHomeEndKeys
                    id={`tags-${item.column.columnDef.accessorKey}`}
                    options={
                      typeof item?.getValue() === "string"
                        ? [item?.getValue()]
                        : item?.getValue()
                    }
                    defaultValue={
                      typeof item?.getValue() === "string"
                        ? [item?.getValue()]
                        : item?.getValue()
                    }
                    onChange={(event, value) => field.onChange(value)}
                    onInputChange={(event, item) => {
                      if (item) field.onChange(item);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id={item.column.columnDef.accessorKey}
                        label={item.column.columnDef.header()}
                        required={
                          !!item.column.columnDef?.fieldFormat?.required
                        }
                        error={errors[item.column.columnDef.accessorKey]}
                        helperText={
                          errors[item.column.columnDef.accessorKey] &&
                          errors[item.column.columnDef.accessorKey]?.message
                        }
                        InputLabelProps={{ shrink: true }}
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
            ) : (
              <Controller
                key={index}
                control={control}
                name={item.column.columnDef.accessorKey}
                defaultValue={item?.getValue()}
                rules={validationRules(item.column.columnDef.accessorKey)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={item.column.columnDef.accessorKey}
                    label={item.column.columnDef.header()}
                    inputRef={field.ref}
                    type={item.column.columnDef?.fieldFormat?.type ?? "text"}
                    required={!!item.column.columnDef?.fieldFormat?.required}
                    error={errors[item.column.columnDef.accessorKey]}
                    helperText={
                      errors[item.column.columnDef.accessorKey] &&
                      errors[item.column.columnDef.accessorKey]?.message
                    }
                    InputProps={
                      item.column.columnDef?.fieldFormat?.format === "money"
                        ? {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }
                        : item.column.columnDef?.fieldFormat?.format ===
                          "percentage"
                        ? {
                            endAdornment: (
                              <InputAdornment position="start">
                                %
                              </InputAdornment>
                            ),
                          }
                        : null
                    }
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
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
        : null,
    [props.itemData, props.edit, control, errors]
  );

  return (
    <Drawer
      anchor="right"
      open={props.drawerOpen || false}
      onClose={props.onClose}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: "22rem" },
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
          onClick={fetchRandomData}
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
            disabled={!createFormFields?.length && !editFormFields?.length}
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

TableDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
  itemData: PropTypes.array,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  dataName: PropTypes.object,
  randomData: PropTypes.object,
};

export default TableDrawer;
