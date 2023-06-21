import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// Project import
import useFetch from "../../hooks/useFetch";
import uniqueFieldError from "../../utils/uniqueFieldError";
import DataTable from "../../components/DataTable/DataTable";
import { formatDate, formatMoney } from "../../utils//formatStrings";

// MUI components
import { Button, Card, Typography } from "@mui/material";

const OrdersTable = memo(() => {
  const navigate = useNavigate();

  // Get total price of all products in a single order
  const getOrderTotal = useCallback((products) => {
    const amount = products.reduce((total, product) => {
      const price = product.price * (1 - product.discountPercentage / 100);
      return total + price;
    }, 0);
    return amount;
  }, []);

  // Get the list of all prodicts in a single order
  const getProductsList = useCallback((products) => {
    const titles = products.map((product) => product.title);
    return titles.join(", ");
  }, []);

  // Get invoice status for a specific order
  const getInvoiceStatus = useCallback((invoice) => {
    const status =
      new Date() > new Date(invoice?.paymentDue)
        ? "overdue"
        : invoice?.paid
        ? "paid"
        : "pending";
    return invoice ? status : null;
  }, []);

  // Set text color based in invoice status
  const setColor = useCallback(
    (invoice) => {
      const status = getInvoiceStatus(invoice);
      return status === "paid"
        ? "success.main"
        : status === "pending"
        ? "warning.main"
        : "error.main";
    },
    [getInvoiceStatus]
  );

  // Specify the name for table data.
  const dataName = useMemo(() => ({ singular: "order", plural: "orders" }), []);

  const [orders, setOrders] = useState(null);

  // State to force data update
  const [reload, setReload] = useState();

  // Fetch data from external api
  const { loading, error, data } = useFetch(
    "http://localhost:4000/api/v1/orders",
    reload
  );

  // Set orders upon fetching data
  useEffect(() => {
    setOrders(data);
  }, [data]);

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
      }),
      columnHelper.accessor("customer", {
        header: () => "Customer",
        cell: (info) =>
          `${info.getValue().firstName} ${info.getValue().lastName}`,
        enableColumnFilter: true,
        fieldFormat: { required: true },
      }),
      columnHelper.accessor("products", {
        header: () => "Products",
        cell: (info) => getProductsList(info.getValue()),
        enableColumnFilter: true,
        fieldFormat: { required: true, format: "multiple" },
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
          <Typography color={setColor(info.getValue())} component="span">
            {getInvoiceStatus(info.getValue()) ?? (
              <Button variant="outlined" size="small">
                Generate
              </Button>
            )}
          </Typography>
        ),
      }),
    ],
    [columnHelper, getInvoiceStatus, getOrderTotal, getProductsList, setColor]
  );

  // Go to order page on row click
  const handleRowClick = (event, rowData) => {
    navigate(`${rowData.id}`);
  };

  // Create new order
  const handleCreateOrder = useCallback(async (formData) => {
    const response = await fetch(`http://localhost:4000/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      // Force reload to update table data
      setReload({});
      // Return order id to display on new order confirmation message
      const orderTitle = `#${data?.id}`;
      return orderTitle;
    } else {
      // Check if the user entered a duplicate value for a unique field
      const uniqueField = uniqueFieldError(response, formData);
      // If it's not a uniqueFieldError, return a generic error
      return uniqueField ?? response;
    }
  }, []);

  // Edit order
  const handleEditOrder = useCallback(async (formData) => {
    // This specific API requires `id` to be of type String
    formData.id = String(formData.id);

    const response = await fetch(
      `http://localhost:4000/api/v1/orders/${formData.id}`,
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
      // Return order name to display on edit confirmation message
      const orderTitle = `#${data?.id}`;
      return orderTitle;
    } else {
      // Check if the user entered a duplicate value for a unique field
      const uniqueField = uniqueFieldError(response, formData);
      // If it's not a uniqueFieldError, return a generic error
      return uniqueField ?? response;
    }
  }, []);

  // Delete order
  const handleDeleteOrder = useCallback(async (orderId) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/orders/${orderId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Force reload to update table data
      setReload({});
      // Return order name to display on delete confirmation message
      const orderTitle = `#${data?.id}`;
      return orderTitle;
    } else {
      const error = await response;
      return error;
    }
  }, []);

  return (
    <Card>
      <DataTable
        minWidth="700px"
        data={orders}
        dataName={dataName}
        columns={columns}
        loading={loading}
        error={error}
        orderBy={"id"}
        globalSearch={true}
        clickable={true}
        reload={reload}
        onRowClick={handleRowClick}
        onCreate={handleCreateOrder}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        // randomData={{ url: "https://dummyjson.com/orders/", maxCount: 10 }}
      />
    </Card>
  );
});

export default OrdersTable;
