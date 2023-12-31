import { createColumnHelper } from "@tanstack/react-table";
import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Project import
import DataTable from "components/DataTable";
import useFetch from "hooks/useFetch";
import {
  customerSchema,
  handleCreateCustomer,
  handleDeleteCustomer,
  handleEditCustomer,
} from "./CustomerActions";

const CustomersTable = memo(() => {
  const navigate = useNavigate();

  // Specify the name for table data
  const dataName = useMemo(
    () => ({ singular: "customer", plural: "customers" }),
    []
  );

  // Set URL and max. count for random data
  const randomData = useMemo(
    () => ({
      url: "https://api.npoint.io/aa41291918be8f428bae/customers",
      maxCount: 10,
    }),
    []
  );

  const [customers, setCustomers] = useState(null);

  // State to force reload on data update
  const [reload, setReload] = useState();

  const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

  // Fetch data from API
  const { loading, error, data } = useFetch(`${API_ENDPOINT}customers`, reload);

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
    navigate(`${rowData.id}`, { state: { dataName, randomData } });
  };

  return (
    <DataTable
      data={customers}
      dataName={dataName}
      columns={columns}
      loading={loading}
      error={error}
      orderBy="id"
      globalSearch={true}
      defaultOrder={true}
      clickable={true}
      reload={() => setReload({})}
      onRowClick={handleRowClick}
      onCreate={handleCreateCustomer}
      onEdit={handleEditCustomer}
      onDelete={handleDeleteCustomer}
      validation={customerSchema}
      randomData={randomData}
    />
  );
});

export default CustomersTable;
