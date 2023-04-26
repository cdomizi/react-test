import PropTypes from "prop-types";
import { useState } from "react";

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

const TableDrawer = ({ drawerOpen, itemData, onSubmit, onClose }) => {
  const [data, setData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(data);
  };

  // create form fields based on row data
  const formFields = itemData
    ?.filter((field) => field.column.columnDef?.fieldFormat?.display ?? true)
    ?.map((field, index) =>
      field.column.columnDef?.fieldFormat?.format === "files" ? (
        <Autocomplete
          multiple
          key={index}
          id="tags"
          options={
            typeof field.getValue() === "string"
              ? [field.getValue()]
              : field.getValue()
          }
          defaultValue={
            typeof field.getValue() === "string"
              ? [field.getValue()]
              : field.getValue()
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
          value={field.getValue()}
          type={field.column.columnDef?.fieldFormat?.type ?? "text"}
          required={field.column.columnDef?.fieldFormat?.required ?? false}
          InputProps={
            field.column.columnDef?.fieldFormat?.format === "money"
              ? {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }
              : field.column.columnDef?.fieldFormat?.format === "percentage"
              ? {
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                }
              : null
          }
          margin="normal"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      )
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
          Edit Item
        </Typography>
        <form onSubmit={handleSubmit}>
          {formFields ?? (
            <Alert severity="info">
              <AlertTitle>No Data</AlertTitle>
              The item you selected contains no data.
            </Alert>
          )}
          <Button
            variant="contained"
            type="submit"
            disabled={!formFields?.length}
            sx={{ mt: 4 }}
          >
            Save Edits
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
};

export default TableDrawer;
