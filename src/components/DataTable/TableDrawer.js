import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";

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
} from "@mui/material";

const TableDrawer = (props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();

  const onSubmit = (formData) => {
    props.onSubmit(formData);
  };

  // Reset the form on submit
  useEffect(() => {
    if (isSubmitSuccessful || !props.drawerOpen) {
      reset();
    }
  }, [props.drawerOpen, isSubmitSuccessful, reset]);

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
                rules={{ required: column.columnDef?.fieldFormat?.required }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={column.columnDef.accessorKey}
                    label={column.columnDef.header()}
                    inputRef={field.ref}
                    type={column.columnDef?.fieldFormat?.type ?? "text"}
                    required={column.columnDef?.fieldFormat?.required ?? false}
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
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      display: column.columnDef?.fieldFormat?.hidden
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
    [props.itemData, props.edit, control]
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={item.column.columnDef.accessorKey}
                    label={item.column.columnDef.header()}
                    inputRef={field.ref}
                    type={item.column.columnDef?.fieldFormat?.type ?? "text"}
                    required={
                      item.column.columnDef?.fieldFormat?.required ?? false
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
    [props.itemData, props.edit, control]
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
          {`${props.edit ? "Edit" : "New"} Item`}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {(createFormFields || editFormFields) ?? (
            <Alert severity="info">
              <AlertTitle>No Data</AlertTitle>
              The item you selected contains no data.
            </Alert>
          )}
          <Button
            variant="contained"
            type="submit"
            disabled={!createFormFields?.length && !editFormFields?.length}
            sx={{ mt: 4 }}
          >
            {`${props.edit ? "Save Edits" : "Add Item"}`}
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
};

export default TableDrawer;
