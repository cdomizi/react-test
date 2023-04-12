import { useEffect, useState, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// project import
import useFetch from "../../hooks/useFetch";
import DataTable from "../../components/DataTable";
import formatMoney from "../../utils/formatMoney";

const ProductsTable = memo(() => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);

  // fetch data from external api
  const { loading, error, data } = useFetch("https://dummyjson.com/products");

  // set products upon fetching data
  useEffect(() => {
    setProducts(data?.products);
  }, [data]);

  // create table columns
  const columnHelper = createColumnHelper();
  const columns = [
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

  // go to product page on row click
  const handleRowClick = (event, rowData) => {
    navigate(`${rowData.id}`);
  };

  return (
    <DataTable
      minWidth="700px"
      data={products}
      columns={columns}
      loading={loading}
      error={error}
      orderBy={"id"}
      rowHover={true}
      onRowClick={handleRowClick}
    />
  );
});

export default ProductsTable;
