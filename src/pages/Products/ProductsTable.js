import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";
import formatMoney from "../../utils/formatMoney";
import DataTable from "../../components/DataTable";

// mui components
import { Card, Typography } from "@mui/material";

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
        enableColumnFilter: false,
      }),
      columnHelper.accessor("title", {
        header: () => "Title",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
      }),
      columnHelper.accessor("brand", {
        header: () => "Brand",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
      }),
      columnHelper.accessor("category", {
        header: () => "Category",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
      }),
      columnHelper.accessor("rating", {
        header: () => "Rating",
        cell: (info) => `${parseFloat(info.getValue()).toFixed(2)}`,
        enableColumnFilter: false,
        align: "right",
      }),
      columnHelper.accessor("price", {
        header: () => "Price",
        cell: (info) => formatMoney(info.getValue(), "dollars"),
        enableColumnFilter: false,
        align: "right",
      }),
      columnHelper.accessor("discountPercentage", {
        header: () => "Discount",
        cell: (info) => `${info.getValue()}%`,
        enableColumnFilter: false,
        align: "right",
      }),
      columnHelper.accessor("stock", {
        header: () => "Stock",
        cell: (info) => (
          <Typography color={() => setColor(info.getValue())} component="span">
            {info.getValue()}
          </Typography>
        ),
        enableColumnFilter: false,
        align: "right",
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
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
  const productsFilters = useMemo(() => {
    return { fields: null, globalSearch: true };
  }, []);

  return (
    <Card>
      <DataTable
        minWidth="700px"
        data={products}
        columns={columns}
        loading={loading}
        error={error}
        orderBy={"id"}
        filterFields={productsFilters}
        clickable={true}
        onRowClick={handleRowClick}
      />
    </Card>
  );
});

export default ProductsTable;
