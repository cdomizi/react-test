import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// Project import
import useFetch from "../../hooks/useFetch";
import { formatMoney } from "../../utils/formatStrings";
import DataTable from "../../components/DataTable/DataTable";

// MUI components
import { Card, Typography } from "@mui/material";

const ProductsTable = memo(() => {
  const navigate = useNavigate();

  // Specify the name for table data.
  const dataName = useMemo(
    () => ({ singular: "product", plural: "products" }),
    []
  );

  const [products, setProducts] = useState(null);

  // State to force data update
  const [reload, setReload] = useState();

  // Fetch data from external api
  const { loading, error, data } = useFetch(
    "http://localhost:4000/api/v1/products",
    reload
  );

  // Set products upon fetching data
  useEffect(() => {
    setProducts(data);
  }, [data]);

  // Set color based on stock quantity
  const setColor = useCallback((quantity) => {
    return quantity >= 10
      ? "success.main"
      : quantity > 0 && quantity < 10
      ? "warning.main"
      : "error.main";
  }, []);

  // Create table columns
  const columnHelper = useMemo(() => createColumnHelper(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => "ID",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
        fieldFormat: { hidden: true },
      }),
      columnHelper.accessor("title", {
        header: () => "Title",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
        fieldFormat: { required: true },
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
        fieldFormat: { range: [1, 5] },
      }),
      columnHelper.accessor("price", {
        header: () => "Price",
        cell: (info) => formatMoney(info.getValue(), "dollars"),
        enableColumnFilter: false,
        align: "right",
        fieldFormat: { format: "money", min: 0 },
      }),
      columnHelper.accessor("discountPercentage", {
        header: () => "Discount",
        cell: (info) => `${info.getValue()}%`,
        enableColumnFilter: false,
        align: "right",
        fieldFormat: { format: "percentage", min: 0 },
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
        fieldFormat: { min: 0 },
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
        align: "left",
      }),
      columnHelper.accessor("thumbnail", {
        header: () => "Thumbnail",
        cell: (info) => info.getValue(),
        isVisible: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("images", {
        header: () => "Images",
        cell: (info) => info.getValue()[0],
        isVisible: false,
        enableColumnFilter: false,
        fieldFormat: { format: "multiple" },
      }),
    ],
    [columnHelper, setColor]
  );

  // Go to product page on row click
  const handleRowClick = (event, rowData) => {
    navigate(`${rowData.id}`);
  };

  // Create new product
  const handleCreateProduct = useCallback(async (formData) => {
    const response = await fetch(`http://localhost:4000/api/v1/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      // Force reload to update table data
      setReload({});
      // Return product name to display on new product confirmation message
      const productTitle = data?.title;
      return productTitle;
    } else {
      const error = await response;
      return error;
    }
  }, []);

  // Edit product
  const handleEditProduct = useCallback(async (formData) => {
    // This specific API requires `id` to be of type String
    formData.id = String(formData.id);

    const response = await fetch(
      `http://localhost:4000/api/v1/products/${formData.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Force reload to update table data
      setReload({});
      // Return product name to display on edit confirmation message
      const productTitle = data?.title;
      return productTitle;
    } else {
      const error = await response;
      return error;
    }
  }, []);

  // Delete product
  const handleDeleteProduct = useCallback(async (productId) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Force reload to update table data
      setReload({});
      // Return product name to display on delete confirmation message
      const productTitle = data?.title;
      return productTitle;
    } else {
      const error = await response;
      return error;
    }
  }, []);

  return (
    <Card>
      <DataTable
        minWidth="700px"
        data={products}
        dataName={dataName}
        columns={columns}
        loading={loading}
        error={error}
        orderBy={"id"}
        globalSearch={true}
        clickable={true}
        reload={reload}
        onRowClick={handleRowClick}
        onCreate={handleCreateProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        randomData={{ url: "https://dummyjson.com/products/", maxCount: 10 }}
      />
    </Card>
  );
});

export default ProductsTable;
