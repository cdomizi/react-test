import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

// Project import
import useFetch from "../../hooks/useFetch";
import { formatMoney } from "../../utils/formatStrings";
import checkUniqueField from "../../utils/checkUniqueField";
import DataTable from "../../components/DataTable/DataTable";

// MUI components
import { Card, Typography } from "@mui/material";

const ProductsTable = memo(() => {
  const navigate = useNavigate();

  // Specify the name for table data
  const dataName = useMemo(
    () => ({ singular: "product", plural: "products" }),
    []
  );

  // Set URL and max. count for random data
  const randomData = useMemo(
    () => ({
      url: "https://dummyjson.com/products/",
      maxCount: 10,
    }),
    []
  );

  const [products, setProducts] = useState(null);

  // State to force reload on data update
  const [reload, setReload] = useState();

  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  // Fetch data from external api
  const { loading, error, data } = useFetch(`${API_ENDPOINT}products`, reload);

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
          <Typography color={setColor(info.getValue())} component="span">
            {info.getValue()}
          </Typography>
        ),
        enableColumnFilter: true,
        // Filter stock within a given range
        filterFn: (row, columnId, value) => {
          const stock = row.getValue(columnId);
          const [min, max] = value.map((amount) =>
            amount?.length ? parseInt(amount) : NaN
          );

          return !isNaN(min) && !isNaN(max)
            ? // Both fields are filled
              stock >= min && stock <= max
            : // Only `min` is filled
            !isNaN(min) && isNaN(max)
            ? stock >= min
            : // Only `max` is filled
            isNaN(min) && !isNaN(max)
            ? stock <= max
            : // Both fields are empty => do not filter
              true;
        },
        align: "right",
        fieldFormat: { min: 0 },
        filterType: { type: "number", min: 0 },
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
  const handleCreateProduct = useCallback(
    async (formData) => {
      const response = await fetch(`${API_ENDPOINT}products`, {
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
        // Check if the user entered a duplicate value for a unique field
        const uniqueField = checkUniqueField(response, formData);
        // If it's not a uniqueFieldError, return a generic error
        return uniqueField ?? response;
      }
    },
    [API_ENDPOINT]
  );

  // Edit product
  const handleEditProduct = useCallback(
    async (formData) => {
      // This specific API requires `id` to be of type String
      formData.id = String(formData.id);

      const response = await fetch(`${API_ENDPOINT}products/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Force reload to update table data
        setReload({});
        // Return product name to display on edit confirmation message
        const productTitle = data?.title;
        return productTitle;
      } else {
        // Check if the user entered a duplicate value for a unique field
        const uniqueField = checkUniqueField(response, formData);
        // If it's not a uniqueFieldError, return a generic error
        return uniqueField ?? response;
      }
    },
    [API_ENDPOINT]
  );

  // Delete product
  const handleDeleteProduct = useCallback(
    async (productId) => {
      const response = await fetch(`${API_ENDPOINT}products/${productId}`, {
        method: "DELETE",
      });

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
    },
    [API_ENDPOINT]
  );

  const convertToNull = (value) => (value === "" ? null : parseFloat(value));

  const productsSchema = yup
    .object()
    .shape({
      title: yup.string().required("This field cannot be empty"),
      brand: yup.string().notRequired(),
      category: yup.string().notRequired(),
      rating: yup
        .number()
        .integer()
        .min(1, "Please enter a number between 1 and 5")
        .max(5, "Please enter a number between 1 and 5")
        .typeError("Please enter a number")
        .notRequired()
        .transform((event, value) => convertToNull(value)),
      price: yup
        .number()
        .min(0, "Price must be at least 0")
        .typeError("Please enter a number")
        .notRequired()
        .transform((event, value) => convertToNull(value)),
      discountPercentage: yup
        .number()
        .moreThan(0, "Discount must be > 0")
        .max(100, "Enter a valid discount percentage")
        .typeError("Please enter a number")
        .notRequired()
        .transform((event, value) => convertToNull(value)),
      stock: yup
        .number()
        .positive("Please enter a valid stock amount")
        .typeError("Please enter a number")
        .notRequired()
        .transform((event, value) => convertToNull(value)),
      description: yup.string().notRequired(),
      thumbnail: yup.string().url("Please enter a valid URL").notRequired(),
      images: yup
        .array()
        .of(yup.string().url("Please enter a valid URL"))
        .notRequired(),
    })
    .required();

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
        defaultOrder={true}
        clickable={true}
        reload={reload}
        onRowClick={handleRowClick}
        onCreate={handleCreateProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        validation={productsSchema}
        randomData={randomData}
      />
    </Card>
  );
});

export default ProductsTable;
