import { useEffect, useState, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";

// project import
import useFetch from "../../hooks/useFetch";
import DataTable from "../../components/DataTable";
import formatMoney from "../../utils/formatMoney";

const ProductTable = memo(() => {
  const [products, setProducts] = useState(null);

  // fetch data from external api
  const { loading, error, data } = useFetch("https://dummyjson.com/products");

  // set products upon fetching data
  useEffect(() => {
    setTimeout(setProducts(data?.products), 2500);
  }, [data]);

  // create table columns
  const columnHelper = createColumnHelper();
  const columns = [
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
      cell: (info) => `${info.getValue()}/5`,
    }),
    columnHelper.accessor("price", {
      header: () => "Price",
      cell: (info) => formatMoney(info.getValue(), "dollars"),
    }),
    columnHelper.accessor("discountPercentage", {
      header: () => "Discount",
      cell: (info) => `${info.getValue()}%`,
    }),
    columnHelper.accessor("stock", {
      header: () => "Stock",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: () => "Description",
      cell: (info) => info.getValue(),
    }),
  ];

  return (
    <DataTable
      minWidth="700px"
      data={products}
      columns={columns}
      loading={loading}
      error={error}
    />
  );
});

export default ProductTable;
