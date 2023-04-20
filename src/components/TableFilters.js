import PropTypes from "prop-types";
import { useCallback } from "react";

// mui components
import {
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

// mui icons
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
}) => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      // format data according to DataTable filter format
      const filtersArray = [];
      formData.forEach((value, key) =>
        filtersArray.push({ id: key, value: value })
      );
      // only set non-empty filters
      onFiltersSubmit(filtersArray.filter((filter) => filter.value.length));
    },
    [onFiltersSubmit]
  );

  return (
    <Stack
      direction="row"
      divider={
        globalSearch && filters?.length ? (
          <Divider orientation="vertical" flexItem />
        ) : (
          false
        )
      }
      spacing={2}
      sx={{ flexGrow: 1, py: "2rem", px: "1rem", alignItems: "baseline" }}
    >
      {globalSearch && (
        <TextField
          label="Global Search"
          onChange={(event) => {
            onGlobalSearch(event.target.value);
          }}
        />
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        onReset={onFiltersReset}
        sx={{
          display: "flex",
          flexGrow: 1,
          flexFlow: "row wrap",
          alignItems: "baseline",
          gap: 2,
        }}
      >
        {filters &&
          filters?.map((filter) => (
            <TextField
              key={filter.id}
              margin="normal"
              id={filter.id}
              name={filter.id}
              label={filter.label}
              InputLabelProps={{ shrink: true }}
            />
          ))}
        <Tooltip title="Apply Filters" sx={{ marginLeft: "auto" }}>
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
  );
};

TableFilters.propTypes = {
  filters: PropTypes.array,
  globalSearch: PropTypes.bool,
  onFiltersSubmit: PropTypes.func,
  onFiltersReset: PropTypes.func,
  onGlobalSearch: PropTypes.func,
};

export default TableFilters;
