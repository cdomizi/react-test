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
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import CustomSnackbar from "../../../components/CustomSnackbar";
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

  // State to force reload on table data update
  const [reload, setReload] = useState();

  // Set up snackbar
  const { snackbarState, dispatch } = useContext(SnackbarContext);
  snackbarState.dataName = "user";

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
  }, [auth?.username, authApi, location, navigate, setAuth, reload]);

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
        });
        return err;
      }
    },
    [authApi, dispatch, reload]
  );

  // Delete user
  const handleDeleteUser = useCallback(
    async (isAdmin, id) => {
      try {
        const response = await authApi.delete(`users/${id}`, {
          isAdmin: !isAdmin,
        });

        // On success, force table reload & notify the user
        setReload({ ...reload });
        dispatch({
          type: SNACKBAR_ACTIONS.DELETE,
          payload: response.data?.username,
        });
        return;
      } catch (err) {
        return err.response;
      }
    },
    [authApi, dispatch, reload]
  );

  // Specify the name for table data
  const dataName = useMemo(() => ({ singular: "user", plural: "users" }), []);

  // Get role value for table row
  const isAdmin = useCallback((value) => (value ? "Admin" : "User"), []);

  // Format role cell for table row
  const roleCell = useCallback(
    (userRole, id) => {
      const role = isAdmin(userRole);
      return (
        <Stack direction="row" justifyContent="center">
          <Typography color={userRole && "success.main"}>{role}</Typography>
          <Button
            onClick={() => handleEditUser(userRole, id)}
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
        cell: (info) => roleCell(info.getValue(), info.row.original.id),
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
          onDelete={handleDeleteUser}
        />
      </Card>
      <CustomSnackbar {...snackbarState} />
    </>
  );
});

export default AdminSection;
