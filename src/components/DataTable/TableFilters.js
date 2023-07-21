import PropTypes from "prop-types";
import { useCallback } from "react";

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
        // filtersArray.push({ id: key, value: value });
      });
      // Only set non-empty filters
      onFiltersSubmit(filtersArray.filter((filter) => filter.value.length));
    },
    [onFiltersSubmit]
  );

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      onReset={onFiltersReset}
      sx={{ py: "2rem", px: "1rem" }}
      spacing={1}
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
              flexFlow: "row wrap",
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
                      margin="normal"
                      id={filter.id}
                      name={filter.id}
                      defaultValue={""}
                      label={filter.label}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ sx: { width: "12rem", textAlign: "left" } }}
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
                    <>
                      <TextField
                        key={filter.id}
                        margin="normal"
                        id={filter.id}
                        name={filter.id}
                        defaultValue={null}
                        label={`Min. ${filter.label}`}
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          sx: { width: "6rem" },
                          ...(typeof filter.type?.min === "number" && {
                            min: filter.type.min,
                          }),
                        }}
                      />
                      <TextField
                        number
                        key={filter.id}
                        margin="normal"
                        id={filter.id}
                        name={filter.id}
                        defaultValue={null}
                        label={`Max. ${filter.label}`}
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          sx: { width: "6rem" },
                          ...(typeof filter.type?.min === "number" && {
                            min: filter.type.min,
                          }),
                        }}
                      />
                    </>
                  );
                default:
                  return (
                    <TextField
                      key={filter.id}
                      margin="normal"
                      id={filter.id}
                      name={filter.id}
                      label={filter.label}
                      InputLabelProps={{ shrink: true }}
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
              <IconButton type="reset" color="primary" size="large">
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
