import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import useFetch from "../../../hooks/useFetch";

import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import DataTable from "../../../components/DataTable/DataTable";

// Fake data for testing - REMOVE
const userData = {
  id: 1,
  username: "testUsername",
  password: "testPassword",
  isAdmin: true,
  // "isAdmin": false,
};

const AdminSection = memo(() => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);

  // State to force reload on data update
  const [reload, setReload] = useState();

  // Fetch data from API
  const { loading, error, data } = useFetch(
    "https://api.npoint.io/0718ccb955c2c322beaa",
    reload
  );

  // Set users upon fetching data from API
  useEffect(() => {
    if (data?.users) {
      // Exclude current user from table data
      const filteredUsers = data.users.filter(
        (user) => user.id !== userData.id
      );
      setUsers(filteredUsers);
    }
  }, [data]);

  // Edit user
  const handleEditUser = useCallback(
    async (formData) => {
      // const response = await fetch(`${API_ENDPOINT}usrs/${formData.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   // Return username to display on edit confirmation message
      //   return data?.username;
      // } else {
      //   const error = await response;
      //   return error;
      // }
      const editedUser =
        users?.find((user) => user.id === formData?.id) || null;

      return editedUser
        ? editedUser?.username
        : {
            action: {
              payload: {
                status: 400,
                statusText: `Could not edit user with id ${formData?.id}`,
              },
            },
          };
    },
    [users]
  );

  // Delete user
  const handleDeleteUser = useCallback(
    (userId) => {
      // const response = await fetch(`${API_ENDPOINT}users/${userId}`, {
      //   method: "DELETE",
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   // Return username to display on delete confirmation message
      //   return data?.username;
      // } else {
      //   const error = await response;
      //   return error;
      // }
      const deletedUser = users?.find((user) => user.id === userId) || null;

      return deletedUser
        ? deletedUser?.username
        : {
            action: {
              payload: {
                status: 400,
                statusText: `Could not delete user with id ${userId}`,
              },
            },
          };
    },
    [users]
  );

  // Specify the name for table data
  const dataName = useMemo(() => ({ singular: "user", plural: "users" }), []);

  // Get role value for table row
  const isAdmin = useCallback((value) => (value ? "Admin" : "User"), []);

  // Format role cell for table row
  const roleCell = useCallback(
    (userRole) => {
      const role = isAdmin(userRole);
      return (
        <Stack direction="row" justifyContent="center">
          <Typography color={userRole && "success.main"}>{role}</Typography>
          <Button
            onClick={handleEditUser}
            variant="outlined"
            size="small"
            sx={{ mx: 2 }}
          >
            Change to {role === "Admin" ? "User" : "Admin"}
          </Button>
        </Stack>
      );
    },
    [handleEditUser, isAdmin]
  );

  // Create table columns
  const columnHelper = useMemo(() => createColumnHelper(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => "ID",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      }),
      columnHelper.accessor("username", {
        header: () => "Username",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
      }),
      columnHelper.accessor("isAdmin", {
        header: () => "Role",
        cell: (info) => roleCell(info.getValue()),
        enableColumnFilter: true,
        // Filter invoice by status
        filterFn: (row, columnId, value) =>
          isAdmin(row.getValue(columnId)) === value,
        filterType: {
          type: "select",
          options: ["Admin", "User"],
        },
      }),
    ],
    [columnHelper, isAdmin, roleCell]
  );

  // Go to customer page on row click
  const handleRowClick = (event, rowData) => {
    navigate(`${rowData.id}`, { state: { dataName } });
  };

  return (
    <>
      <Divider sx={{ my: 7 }} />
      <Typography variant="h5" mb={5}>
        Admin Panel
      </Typography>
      <Typography mb={4}>
        Users currently registered:{" "}
        <Box component="span" fontWeight="bold">
          {
            // Add 1 to the number of registered users
            // since the current user is filtered out from the table
            users?.length + 1 || 0
          }
        </Box>
      </Typography>
      <Card>
        <DataTable
          sx={{ maxWidth: "fit-content" }}
          data={users}
          dataName={dataName}
          columns={columns}
          loading={loading}
          error={error}
          orderBy={"id"}
          globalSearch={false}
          defaultOrder={false}
          clickable={false}
          reload={() => setReload({})}
          onRowClick={handleRowClick}
          onDelete={handleDeleteUser}
        />
      </Card>
    </>
  );
});

export default AdminSection;
