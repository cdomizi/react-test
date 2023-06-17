import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// Project import
import useFetch from "../../hooks/useFetch";
import uniqueFieldError from "../../utils/uniqueFieldError";
import DataTable from "../../components/DataTable/DataTable";

// MUI components
import { Card } from "@mui/material";

const CustomersTable = memo(() => {
  const navigate = useNavigate();

  // Specify the name for table data.
  const dataName = useMemo(
    () => ({ singular: "customer", plural: "customers" }),
    []
  );

  const [customers, setCustomers] = useState(null);

  // State to force data update
  const [reload, setReload] = useState();

  // Fetch data from external api
  const { loading, error, data } = useFetch(
    "http://localhost:4000/api/v1/customers",
    reload
  );

  // Set customers upon fetching data
  useEffect(() => {
    setCustomers(data);
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
      columnHelper.accessor("firstName", {
        header: () => "First Name",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
        fieldFormat: { required: true },
      }),
      columnHelper.accessor("lastName", {
        header: () => "Last Name",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
        fieldFormat: { required: true },
      }),
      columnHelper.accessor("email", {
        header: () => "Email",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
        fieldFormat: { required: true },
      }),
      columnHelper.accessor("address", {
        header: () => "Address",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
        fieldFormat: { required: true },
      }),
    ],
    [columnHelper]
  );

  // Go to customer page on row click
  const handleRowClick = (event, rowData) => {
    navigate(`${rowData.id}`);
  };

  // Create new customer
  const handleCreateCustomer = useCallback(async (formData) => {
    const response = await fetch(`http://localhost:4000/api/v1/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      // Force reload to update table data
      setReload({});
      // Return customer name to display on new customer confirmation message
      const customerName = `${data?.firstName} ${data?.lastName}`;
      return customerName;
    } else {
      // Check if the user entered a duplicate value for a unique field
      const uniqueField = uniqueFieldError(response, formData);
      // If it's not a uniqueFieldError, return a generic error
      return uniqueField ?? response;
    }
  }, []);

  // Edit customer
  const handleEditCustomer = useCallback(async (formData) => {
    // This specific API requires `id` to be of type String
    formData.id = String(formData.id);

    const response = await fetch(
      `http://localhost:4000/api/v1/customers/${formData.id}`,
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
      // Return customer name to display on edit confirmation message
      const customerName = `${data?.firstName} ${data?.lastName}`;
      return customerName;
    } else {
      // Check if the user entered a duplicate value for a unique field
      const uniqueField = uniqueFieldError(response, formData);
      // If it's not a uniqueFieldError, return a generic error
      return uniqueField ?? response;
    }
  }, []);

  // Delete customer
  const handleDeleteCustomer = useCallback(async (customerId) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/customers/${customerId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Force reload to update table data
      setReload({});
      // Return customer name to display on delete confirmation message
      const customerName = `${data?.firstName} ${data?.lastName}`;
      return customerName;
    } else {
      const error = await response;
      return error;
    }
  }, []);

  return (
    <Card>
      <DataTable
        minWidth="700px"
        data={customers}
        dataName={dataName}
        columns={columns}
        loading={loading}
        error={error}
        orderBy={"id"}
        globalSearch={true}
        clickable={true}
        reload={reload}
        onRowClick={handleRowClick}
        onCreate={handleCreateCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        randomData={{
          url: "https://api.npoint.io/aa41291918be8f428bae/customers",
          maxCount: 10,
        }}
      />
    </Card>
  );
});

export default CustomersTable;
