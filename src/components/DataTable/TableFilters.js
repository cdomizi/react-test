import PropTypes from "prop-types";
import { Fragment, useCallback, useMemo, useState } from "react";

// MUI components
import {
  Box,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  capitalize,
} from "@mui/material";

// MUI icons
import {
  Clear as ClearIcon,
  FilterAlt as FilterAltIcon,
  FilterAltOff as FilterAltOffIcon,
} from "@mui/icons-material";

const TableFilters = ({
  filters,
  globalSearch,
  onFiltersSubmit,
  onFiltersReset,
  onGlobalSearch,
  children,
}) => {
  const defaultValues = useMemo(() => {
    const fields = filters?.map((filter) =>
      filter?.type?.type === "number"
        ? // For number fields, split value in `min` & `max`
          { [filter.id]: { min: null, max: null } }
        : filter?.type?.type === "date"
        ? // For date fields, split value in `from` & `before`
          { [filter.id]: { from: null, before: null } }
        : { [filter.id]: "" }
    );
    return fields;
  }, [filters]);

  // Form fields values
  const [values, setValues] = useState(defaultValues);

  const handleChange = useCallback(
    (event, prop) => {
      const { name, value } = event.target;

      prop
        ? setValues({
            ...values,
            [name]: { ...values[name], [prop]: value },
          })
        : setValues({
            ...values,
            [name]: value,
          });
    },
    [values]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      // Format data according to DataTable filter format
      const filtersArray = [];
      formData.forEach((value, key) => {
        const duplicate = filtersArray.findIndex(({ id }) => id === key);
        duplicate >= 0
          ? (filtersArray[duplicate].value = [
              filtersArray[duplicate].value,
              value,
            ])
          : filtersArray.push({ id: key, value: value });
      });
      // Only set non-empty filters
      onFiltersSubmit(filtersArray.filter((filter) => filter.value.length));
    },
    [onFiltersSubmit]
  );

  return (
    <Stack
      id="table-filters-container"
      component="form"
      onSubmit={handleSubmit}
      spacing={1}
      sx={{ py: "2rem", px: "1rem" }}
    >
      <Box
        sx={{ display: "flex", flexFlow: "row nowrap", alignItems: "center" }}
      >
        {globalSearch && (
          <TextField
            label="Global Search"
            onChange={(event) => {
              onGlobalSearch(event.target.value);
            }}
            sx={{ justifySelf: "flex-start" }}
          />
        )}
        {children}
      </Box>
      {!!filters?.length && (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexGrow: 1,
              flexFlow: { xs: "column wrap", md: "row wrap" },
              alignItems: "baseline",
              gap: 2,
            }}
          >
            {filters?.map((filter) => {
              switch (filter?.type?.type) {
                case "select":
                  return (
                    <TextField
                      select
                      key={filter.id}
                      id={filter.id}
                      name={filter.id}
                      value={values[filter.id] || ""}
                      onChange={(event) => handleChange(event)}
                      label={filter.label}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ sx: { width: "12rem", textAlign: "left" } }}
                      margin="normal"
                    >
                      {filter.type.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {!!option ? capitalize(option) : "None"}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                case "number":
                  return (
                    <Fragment key={filter.id}>
                      <TextField
                        key={`${filter.id}.min`}
                        id={`${filter.id}.min`}
                        name={filter.id}
                        value={values[filter.id]?.min || ""}
                        onChange={(event) => handleChange(event, "min")}
                        label={`Min. ${filter.label}`}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          sx: { width: "6rem" },
                          ...(typeof filter.type?.min === "number" && {
                            min: filter.type.min,
                          }),
                        }}
                        type="number"
                        margin="normal"
                      />
                      <TextField
                        key={`${filter.id}.max`}
                        id={`${filter.id}.max`}
                        name={filter.id}
                        value={values[filter.id]?.max || ""}
                        onChange={(event) => handleChange(event, "max")}
                        label={`Max. ${filter.label}`}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          sx: { width: "6rem" },
                          ...(typeof filter.type?.min === "number" && {
                            min: filter.type.min,
                          }),
                        }}
                        type="number"
                        margin="normal"
                      />
                    </Fragment>
                  );
                case "date":
                  return (
                    <Fragment key={filter.id}>
                      <TextField
                        key={`${filter.id}.from`}
                        id={`${filter.id}.from`}
                        name={filter.id}
                        value={values[filter.id]?.from || ""}
                        onChange={(event) => handleChange(event, "from")}
                        label="From"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          ...(values[filter.id]?.from && {
                            endAdornment: (
                              <IconButton
                                onClick={() =>
                                  // Clear value
                                  setValues({
                                    ...values,
                                    [filter.id]: {
                                      ...values[filter.id],
                                      from: "",
                                    },
                                  })
                                }
                              >
                                <ClearIcon />
                              </IconButton>
                            ),
                          }),
                        }}
                        type="date"
                        margin="normal"
                      />
                      <TextField
                        key={`${filter.id}.before`}
                        id={`${filter.id}.before`}
                        name={filter.id}
                        value={values[filter.id]?.before || ""}
                        onChange={(event) => handleChange(event, "before")}
                        label="Before"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          ...(values[filter.id]?.before && {
                            endAdornment: (
                              <IconButton
                                onClick={() =>
                                  // Clear value
                                  setValues({
                                    ...values,
                                    [filter.id]: {
                                      ...values[filter.id],
                                      before: "",
                                    },
                                  })
                                }
                              >
                                <ClearIcon />
                              </IconButton>
                            ),
                          }),
                        }}
                        type="date"
                        margin="normal"
                      />
                    </Fragment>
                  );
                default:
                  return (
                    <TextField
                      key={filter.id}
                      id={filter.id}
                      name={filter.id}
                      value={values[filter.id] || ""}
                      onChange={(event) => handleChange(event)}
                      label={filter.label}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                    />
                  );
              }
            })}
          </Box>
          <Box sx={{ whiteSpace: "nowrap" }}>
            <Tooltip title="Apply Filters" sx={{ ml: "auto" }}>
              <IconButton type="submit" color="primary" size="large">
                <FilterAltIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Filters">
              <IconButton
                onClick={() => {
                  setValues(defaultValues);
                  onFiltersReset();
                }}
                type="reset"
                color="primary"
                size="large"
              >
                <FilterAltOffIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

TableFilters.propTypes = {
  filters: PropTypes.array,
  globalSearch: PropTypes.bool,
  onFiltersSubmit: PropTypes.func,
  onFiltersReset: PropTypes.func,
  onGlobalSearch: PropTypes.func,
  children: PropTypes.element,
};

export default TableFilters;
