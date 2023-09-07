import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createColumnHelper } from "@tanstack/react-table";

// Project import
import useAuthApi from "../../../hooks/useAuthApi";
import AuthContext from "../../../contexts/AuthContext";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import DataTable from "../../../components/DataTable";

// MUI components
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";

const AdminSection = memo(() => {
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

  // State to force reload on table data update
  const [reload, setReload] = useState();

  const dispatch = useContext(SnackbarContext);
  const dataName = useMemo(() => ({ singular: "user", plural: "users" }), []);

  // Get users data
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
        }
        return;
      }
    };

    getUsers();

    return function cleanup() {
      ignore = true;
      abortController.abort();
    };
    // Add `reload` to the dependencies to force reload
  }, [auth?.username, authApi, setAuth, reload]);

  // Edit user
  const handleEditUser = useCallback(
    async (isAdmin, id) => {
      try {
        const response = await authApi.put(`users/${id}`, {
          isAdmin: !isAdmin,
        });

        // On success, force table reload & notify the user
        setReload({ ...reload });
        dispatch({
          type: SNACKBAR_ACTIONS.EDIT,
          payload: response.data?.username,
          dataName,
        });
        return;
      } catch (err) {
        // On error, return the error
        dispatch({
          type: SNACKBAR_ACTIONS.EDIT_ERROR,
          payload: {
            status: err.response.status,
            statusText: err.response.statusText,
          },
          dataName,
        });
        return err;
      }
    },
    [authApi, dataName, dispatch, reload]
  );

  // Delete user
  const handleDeleteUser = useCallback(
    async (id) => {
      try {
        const response = await authApi.delete(`users/${id}`);

        // On success, force table reload
        // & return username name to display on delete confirmation message
        setReload({ ...reload });
        return response.data?.username;
      } catch (err) {
        return err?.response;
      }
    },
    [authApi, reload]
  );

  // Get role value for table row
  const isAdmin = useCallback((value) => (value ? "Admin" : "User"), []);

  // Format role cell for table row
  const roleCell = useCallback(
    (userRole, id) => {
      const role = isAdmin(userRole);
      return (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Typography color={userRole && "success.main"}>{role}</Typography>
          <Button
            onClick={() => handleEditUser(userRole, id)}
            variant="outlined"
            size="small"
            sx={{ mx: 2, minWidth: "fit-content" }}
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
        cell: (info) => roleCell(info.getValue(), info.row.original.id),
        enableColumnFilter: true,
        // Filter invoice by status
        filterFn: (row, columnId, value) =>
          isAdmin(row.getValue(columnId)) === value,
        filterType: {
          type: "select",
          options: ["Admin", "User"],
        },
        style: { maxWidth: "13.5rem" },
      }),
    ],
    [columnHelper, isAdmin, roleCell]
  );

  return (
    <Box id="admin-section-container">
      <Divider sx={{ my: 7, py: 1 }} />
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
      <Card>
        <DataTable
          data={fetchState?.data}
          dataName={dataName}
          columns={columns}
          loading={fetchState.loading}
          error={fetchState.error}
          orderBy="id"
          globalSearch={false}
          defaultOrder={false}
          clickable={false}
          onDelete={handleDeleteUser}
        />
      </Card>
    </Box>
  );
});

export default AdminSection;
