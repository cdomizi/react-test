import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useLocation, useNavigate } from "react-router";

// Project import
import useAuthApi from "../../../hooks/useAuthApi";
import AuthContext from "../../../contexts/AuthContext";
import DataTable from "../../../components/DataTable";

// MUI components
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";

const AdminSection = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const { auth, setAuth } = useContext(AuthContext);

  const fetchInitialState = useMemo(
    () => ({
      loading: true,
      error: null,
      data: undefined,
    }),
    []
  );
  const [fetchState, setfetchState] = useState(fetchInitialState);

  const authApi = useAuthApi();

  useEffect(() => {
    // Initialize AbortController & variable for cleanup
    const abortController = new AbortController();
    let ignore = false;

    const getUsers = async () => {
      try {
        const response = await authApi.get("users", {
          signal: abortController.signal,
        });

        // Exclude current user from table data
        const filteredUsers = response?.data?.filter(
          (user) => user.username !== auth?.username
        );

        !ignore &&
          setfetchState((prevState) => ({
            ...prevState,
            loading: false,
            error: undefined,
            data: filteredUsers,
          }));
      } catch (err) {
        // Check that error was not caused by abortController
        if (!abortController.signal.aborted) {
          console.error(err);

          // Session expired, set error state
          setfetchState((prevState) => ({
            ...prevState,
            loading: false,
            error: err,
            data: undefined,
          }));
          // Clean auth context
          setAuth({});
          // Redirect user to login page
          navigate("/login", {
            state: { from: location, sessionExpired: true },
            replace: true,
          });
        }

        return;
      }
    };

    getUsers();

    return function cleanup() {
      ignore = true;
      abortController.abort();
    };
  }, [auth?.username, authApi, location, navigate, setAuth]);

  // // Set users upon fetching data from API
  // useEffect(() => {
  //   if (fetchState?.data) {
  //     // Exclude current user from table data
  //     const filteredUsers = fetchState.data.filter(
  //       (user) => user.username !== props?.username
  //     );
  //     setfetchState((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //       error: false,
  //       data: filteredUsers,
  //     }));
  //   }
  // }, [fetchState?.data, props?.username]);

  // Edit user
  const handleEditUser = useCallback(
    async (formData) => {
      // const response = await fetch(`${API_ENDPOINT}users/${formData.id}`, {
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
        fetchState?.data?.find((user) => user.id === formData?.id) || null;

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
    [fetchState?.data]
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
      const deletedUser =
        fetchState?.data?.find((user) => user.id === userId) || null;

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
    [fetchState?.data]
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
            fetchState?.data?.length + 1 || 0
          }
        </Box>
      </Typography>
      <Card sx={{ maxWidth: "fit-content" }}>
        <DataTable
          sx={{ maxWidth: "fit-content" }}
          data={fetchState?.data}
          dataName={dataName}
          columns={columns}
          loading={fetchState.loading}
          error={fetchState.error}
          orderBy={"id"}
          globalSearch={false}
          defaultOrder={false}
          clickable={false}
          onRowClick={handleRowClick}
          onDelete={handleDeleteUser}
        />
      </Card>
    </>
  );
});

export default AdminSection;
