import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";
import DataTable from "../../components/DataTable";
import formatMoney from "../../utils/formatMoney";

// mui components
import {
  Button,
  Card,
  Divider,
  Typography,
  Box,
  Stack,
  TextField,
} from "@mui/material";

const ProductsTable = memo(() => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);

  // fetch data from external api
  const { loading, error, data } = useFetch("https://dummyjson.com/products");

  // set products upon fetching data
  useEffect(() => {
    setProducts(data?.products);
  }, [data]);

  // set color based on stock quantity
  const setColor = useCallback((quantity) => {
    return quantity >= 10
      ? "success.main"
      : quantity > 0 && quantity < 10
      ? "warning.main"
      : "error.main";
  }, []);

  // create table columns
  const columnHelper = useMemo(() => createColumnHelper(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("title", {
        header: () => "Title",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("brand", {
        header: () => "Brand",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: () => "Category",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("rating", {
        header: () => "Rating",
        cell: (info) => `${parseFloat(info.getValue()).toFixed(2)}`,
        align: "right",
      }),
      columnHelper.accessor("price", {
        header: () => "Price",
        cell: (info) => formatMoney(info.getValue(), "dollars"),
        align: "right",
      }),
      columnHelper.accessor("discountPercentage", {
        header: () => "Discount",
        cell: (info) => `${info.getValue()}%`,
        align: "right",
      }),
      columnHelper.accessor("stock", {
        header: () => "Stock",
        cell: (info) => (
          <Typography color={() => setColor(info.getValue())} component="span">
            {info.getValue()}
          </Typography>
        ),
        align: "right",
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
        cell: (info) => info.getValue(),
        align: "left",
      }),
    ],
    [columnHelper, setColor]
  );

  // go to product page on row click
  const handleRowClick = (event, rowData) => {
    navigate(`${rowData.id}`);
  };

  // table filters
  const [globalSearch, setglobalSearch] = useState("");
  const [productsFilters, setProductsFilters] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // format data according to DataTable filter format
    const filtersArray = [];
    formData.forEach((value, key) =>
      filtersArray.push({ id: key, value: value })
    );
    // only set non-empty filters
    setProductsFilters(filtersArray.filter((filter) => filter.value.length));
  };

  const handleReset = (event) => {
    setProductsFilters(null);
  };

  const TableFilters = useMemo(() => {
    return (
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        sx={{ flexGrow: 1, py: "2rem", px: "1rem", alignItems: "baseline" }}
      >
        <TextField
          label="Global Search"
          value={globalSearch}
          onChange={(e) => {
            setglobalSearch(e.target.value);
          }}
        />
        <Box
          component="form"
          onSubmit={handleSubmit}
          onReset={handleReset}
          sx={{
            display: "flex",
            flexGrow: 1,
            flexFlow: "row wrap",
            alignItems: "baseline",
            gap: 2,
          }}
        >
          <TextField
            margin="normal"
            id="brand"
            label="Brand"
            name="brand"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            id="category"
            label="Category"
            name="category"
            InputLabelProps={{ shrink: true }}
          />
          <Button type="submit" variant="contained" sx={{ marginLeft: "auto" }}>
            Apply
          </Button>
          <Button type="reset" variant="contained" sx={{ marginLeft: "auto" }}>
            Reset
          </Button>
        </Box>
      </Stack>
    );
  }, [globalSearch, setglobalSearch]);

  return (
    <Card>
      {TableFilters}
      <Divider />
      <DataTable
        minWidth="700px"
        data={products}
        columns={columns}
        loading={loading}
        error={error}
        orderBy={"id"}
        globalSearch={globalSearch}
        filters={productsFilters}
        clickable={true}
        onRowClick={handleRowClick}
      />
    </Card>
  );
});

export default ProductsTable;
