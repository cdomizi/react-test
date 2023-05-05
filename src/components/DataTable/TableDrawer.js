import PropTypes from "prop-types";
import { useMemo } from "react";

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

const TableDrawer = ({ drawerOpen, itemData, onSubmit, onClose, edit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(formData);
  };

  // Create new-item-form fields based on row data
  const createFormFields = useMemo(
    () =>
      !edit
        ? itemData?.map((column, index) =>
            column.columnDef?.fieldFormat?.format === "files" ? (
              <Autocomplete
                multiple
                key={index}
                id="tags"
                freeSolo
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id={column.columnDef.accessorKey}
                    name={column.columnDef.accessorKey}
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
            ) : (
              <TextField
                key={index}
                id={column.columnDef.accessorKey}
                name={column.columnDef.accessorKey}
                label={column.columnDef.header()}
                type={column.columnDef?.fieldFormat?.type ?? "text"}
                required={column.columnDef?.fieldFormat?.required ?? false}
                InputProps={
                  column.columnDef?.fieldFormat?.format === "money"
                    ? {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }
                    : column.columnDef?.fieldFormat?.format === "percentage"
                    ? {
                        endAdornment: (
                          <InputAdornment position="start">%</InputAdornment>
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
            )
          )
        : null,
    [itemData, edit]
  );

  // Create edit-item-form fields based on row data
  const editFormFields = useMemo(
    () =>
      edit
        ? itemData?.map((field, index) =>
            field.column.columnDef?.fieldFormat?.format === "files" ? (
              <Autocomplete
                multiple
                key={index}
                id="tags"
                freeSolo
                options={
                  typeof field?.getValue() === "string"
                    ? [field?.getValue()]
                    : field?.getValue()
                }
                defaultValue={
                  typeof field?.getValue() === "string"
                    ? [field?.getValue()]
                    : field?.getValue()
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id={field.column.columnDef.accessorKey}
                    name={field.column.columnDef.accessorKey}
                    label={field.column.columnDef.header()}
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
            ) : (
              <TextField
                key={index}
                id={field.column.columnDef.accessorKey}
                name={field.column.columnDef.accessorKey}
                label={field.column.columnDef.header()}
                defaultValue={field?.getValue()}
                type={field.column.columnDef?.fieldFormat?.type ?? "text"}
                required={
                  field.column.columnDef?.fieldFormat?.required ?? false
                }
                InputProps={
                  field.column.columnDef?.fieldFormat?.format === "money"
                    ? {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }
                    : field.column.columnDef?.fieldFormat?.format ===
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
                sx={{
                  display: field.column.columnDef?.fieldFormat?.hidden
                    ? "none"
                    : "inherit",
                }}
                fullWidth
              />
            )
          )
        : null,
    [itemData, edit]
  );

  return (
    <Drawer
      anchor="right"
      open={drawerOpen || false}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: "22rem" },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
        <Typography variant="h4" mb={6}>
          {`${edit ? "Edit" : "New"} Item`}
        </Typography>
        <form onSubmit={handleSubmit}>
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
            {`${edit ? "Save Edits" : "Add Item"}`}
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
