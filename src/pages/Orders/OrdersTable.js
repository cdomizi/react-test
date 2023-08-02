import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// Project import
import useFetch from "../../hooks/useFetch";
import DataTable from "../../components/DataTable/DataTable";
import OrdersDrawer from "./OrdersDrawer";
import {
  handleCreateOrder,
  handleEditOrder,
  handleDeleteOrder,
  getInvoiceStatus,
  setInvoiceColor,
} from "./OrderActions";
import { formatDate, formatMoney } from "../../utils/formatStrings";

// MUI components
import { Card, Typography } from "@mui/material";

const OrdersTable = memo(() => {
  const navigate = useNavigate();

  // Specify the name for table data
  const dataName = useMemo(() => ({ singular: "order", plural: "orders" }), []);

  const [orders, setOrders] = useState(null);

  // State to force reload on data update
  const [reload, setReload] = useState();

  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  // Fetch orders data
  const { loading, error, data } = useFetch(`${API_ENDPOINT}orders`, reload);

  // Set orders upon fetching data
  useEffect(() => {
    setOrders(data);
  }, [data]);

  // Fetch products data
  const {
    loading: productLoading,
    error: productError,
    data: productData,
  } = useFetch(`${API_ENDPOINT}products`, reload);

  // Get product data by ID including quantity
  const getProduct = useCallback(
    (item) => ({
      item: productData?.find((product) => product?.id === item?.productId),
      quantity: item?.quantity,
    }),
    [productData]
  );

  // Get total price of all products in a single order
  const getOrderTotal = useCallback(
    (products) => {
      const orderProducts = products?.map((product) => getProduct(product));
      const amount = orderProducts?.reduce((total, product) => {
        const price =
          product?.item.price *
          (1 - product?.item.discountPercentage / 100) *
          product?.quantity;
        return total + price;
      }, 0);
      // Return 0 if `amount` is null/undefined
      return amount || 0;
    },
    [getProduct]
  );

  // Get the list of all prodicts in a single order (including quantity)
  const getProductsList = useCallback(
    (products) => {
      const titles = products.map(
        (product) =>
          `${product?.quantity}× #${getProduct(product)?.item.id} ${
            getProduct(product)?.item.title
          }`
      );
      // Return "None" if products list is empty/null/undefined
      return titles.join(", ") || "None";
    },
    [getProduct]
  );

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
      columnHelper.accessor("createdAt", {
        header: () => "Date",
        cell: (info) => formatDate(info.getValue()),
        enableColumnFilter: true,
        fieldFormat: { hidden: true },
        filterType: { type: "date" },
        // Filter date within a given range
        filterFn: (row, columnId, value) => {
          const date = new Date(row.getValue(columnId));
          const [from, before] = value.map((date) =>
            date?.length ? moment(date) : NaN
          );

          return !isNaN(from) && !isNaN(before)
            ? // Both fields are filled
              date >= from && date <= before
            : // Only `from` is filled
            !isNaN(from) && isNaN(before)
            ? date >= from
            : // Only `before` is filled
            isNaN(from) && !isNaN(before)
            ? date <= before
            : // Both fields are empty => do not filter
              true;
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: () => "Updated",
        cell: (info) => formatDate(info.getValue()),
        isVisible: false,
        enableColumnFilter: true,
        fieldFormat: { hidden: true },
      }),
      columnHelper.accessor("customer", {
        header: () => "Customer",
        cell: (info) =>
          `${info.getValue().firstName} ${info.getValue().lastName}`,
        enableColumnFilter: true,
        // Filter customer by name
        filterFn: (row, columnId, value) => {
          const { firstName, lastName } = row.getValue(columnId);
          const filterValue = value.toLowerCase().trim();

          return (
            firstName.toLowerCase().includes(filterValue) ||
            lastName.toLowerCase().includes(filterValue)
          );
        },
        fieldFormat: { required: true },
      }),
      columnHelper.accessor("products", {
        header: () => "Products",
        cell: (info) => getProductsList(info.getValue()),
        enableColumnFilter: true,
        // Filter products by title
        filterFn: (row, columnId, value) => {
          const products = getProductsList(
            row.getValue(columnId)
          ).toLowerCase();

          return products.includes(value.toLowerCase().trim());
        },
        fieldFormat: { required: true },
      }),
      columnHelper.display({
        id: "total",
        header: () => "Total",
        cell: (props) =>
          formatMoney(getOrderTotal(props.row.original.products), "dollars"),
        align: "right",
        fieldFormat: { exclude: true, format: "money", min: 0 },
      }),
      columnHelper.accessor("invoice", {
        header: () => "Invoice",
        cell: (info) => (
          <Typography
            color={
              !!info.getValue() ? setInvoiceColor(info.getValue()) : "inherit"
            }
            component="span"
          >
            {getInvoiceStatus(info.getValue()) ?? "None"}
          </Typography>
        ),
        enableColumnFilter: true,
        // Filter invoice by status
        filterFn: (row, columnId, value) => {
          const status = getInvoiceStatus(row.getValue(columnId)) ?? "none";

          return status === value;
        },
        fieldFormat: { checkbox: true },
        filterType: {
          type: "select",
          options: ["none", "pending", "paid", "overdue"],
        },
      }),
    ],
    [columnHelper, getOrderTotal, getProductsList]
  );

  // Go to order page on row click
  const handleRowClick = (event, rowData) => {
    navigate(`${rowData.id}`, { state: { dataName } });
  };

  return (
    <Card>
      <DataTable
        minWidth="700px"
        data={orders}
        dataName={dataName}
        columns={columns}
        loading={loading || productLoading}
        error={error || productError}
        orderBy={"updatedAt"}
        globalSearch={false}
        defaultOrder={true}
        clickable={true}
        reload={() => setReload({})}
        onRowClick={handleRowClick}
        onCreate={handleCreateOrder}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        customDrawer={OrdersDrawer}
      />
    </Card>
  );
});

export default OrdersTable;
