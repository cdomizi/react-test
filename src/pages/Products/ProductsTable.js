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
  const [products, setProducts] = useState(null);

  // Fetch data from external api
  const { loading, error, data } = useFetch("https://dummyjson.com/products");

  // Set products upon fetching data
  useEffect(() => {
    setProducts(data?.products);
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
        fieldFormat: { format: "money" },
      }),
      columnHelper.accessor("discountPercentage", {
        header: () => "Discount",
        cell: (info) => `${info.getValue()}%`,
        enableColumnFilter: false,
        align: "right",
        fieldFormat: { format: "percentage" },
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
        fieldFormat: { type: "number" },
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
    const response = await fetch(`https://dummyjson.com/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
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
    // This specific API requires `id` to be of type String.
    formData.id = String(formData.id);

    const response = await fetch(
      `https://dummyjson.com/products/${formData.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      const data = await response.json();
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
      `https://dummyjson.com/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const data = await response.json();
      const productTitle = data?.title;
      // Return product name to display on delete confirmation message
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
        columns={columns}
        loading={loading}
        error={error}
        orderBy={"id"}
        globalSearch={true}
        clickable={true}
        onRowClick={handleRowClick}
        onCreate={handleCreateProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </Card>
  );
});

export default ProductsTable;
