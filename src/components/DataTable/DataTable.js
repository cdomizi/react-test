import PropTypes from "prop-types";
import { useMemo, useCallback, useState, useReducer } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

// Project imports
import TableFilters from "./TableFilters";
import TableDrawer from "./TableDrawer";
import TableSnackbar from "./TableSnackbar";

// MUI components
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Divider,
  Skeleton,
  Alert,
  AlertTitle,
  useMediaQuery,
  TableSortLabel,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";

// MUI icons
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

// Snackbar reducer actions
const SNACKBAR_ACTIONS = {
  EDIT: "edit",
  EDIT_ERROR: "edit error",
  DELETE: "delete",
  DELETE_ERROR: "delete error",
  CLOSE: "close",
};

// Initial snackbar status
const initialSnackbarStatus = {
  open: false,
  vertical: "top",
  horizontal: "center",
  success: true,
  message: null,
};

// Snackbar reducer function
const snackbarReducer = (state, action) => {
  switch (action.type) {
    case SNACKBAR_ACTIONS.EDIT: {
      return {
        ...initialSnackbarStatus,
        open: true,
        success: true,
        message: `${action.payload || "Item"} edited successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.EDIT_ERROR: {
      console.error(
        `Error while editing the item: ${action.payload.status} - ${action.payload.statusText}`
      );
      return {
        ...initialSnackbarStatus,
        open: true,
        success: false,
        message: "Sorry! Unable to edit the item.",
      };
    }
    case SNACKBAR_ACTIONS.DELETE: {
      return {
        ...initialSnackbarStatus,
        open: true,
        success: true,
        message: `${action.payload || "Item"} deleted successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.DELETE_ERROR: {
      console.error(
        `Error while deleting the item: ${action.payload.status} - ${action.payload.statusText}`
      );
      return {
        ...initialSnackbarStatus,
        open: true,
        success: false,
        message: "Sorry! Unable to delete the item.",
      };
    }
    case SNACKBAR_ACTIONS.CLOSE: {
      return initialSnackbarStatus;
    }
    default: {
      return state;
    }
  }
};

const DataTable = (props) => {
  const {
    minWidth,
    data,
    columns,
    loading,
    error,
    rowsPerPageOptions = [5, 10, 25],
    orderBy = null,
    globalSearch = false,
    defaultOrder = false,
    clickable = false,
    onRowClick = null,
    onEdit = null,
    onDelete = null,
  } = props;

  const defaultSorting = [{ id: orderBy, desc: defaultOrder }];
  const [sorting, setSorting] = useState(defaultSorting ?? []);

  // Global filter
  const [globalFilter, setGlobalFilter] = useState("");

  // Column filter
  const [columnFilters, setColumnFilters] = useState([]);

  const initialDrawerStatus = useMemo(
    () => ({ open: false, payload: null, edit: false }),
    []
  );

  // EditDrawer status
  const [editDrawerStatus, setEditDrawerStatus] = useState({
    ...initialDrawerStatus,
    edit: true,
  });

  // AddDrawer status
  const [addDrawerStatus, setAddDrawerStatus] = useState({
    ...initialDrawerStatus,
  });

  // Snackbar reducer
  const [snackbarState, dispatch] = useReducer(
    snackbarReducer,
    initialSnackbarStatus
  );

  const hiddenColumns = useMemo(
    () =>
      columns.reduce(
        (obj, column) => ({
          ...obj,
          [column.accessorKey]: column.isVisible ?? true,
        }),
        {}
      ),
    [columns]
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    pageCount: data?.length ?? -1,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility: hiddenColumns,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePageChange = useCallback(
    (event, newPage) => {
      table.setPageIndex(newPage);
    },
    [table]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      table.setPageSize(newRowsPerPage);
    },
    [table]
  );

  // Handle add button click
  const handleOnAdd = useCallback(
    async (event) => {
      event.stopPropagation();
      setAddDrawerStatus({
        ...addDrawerStatus,
        open: true,
        payload: table.getAllFlatColumns(),
      });
    },
    [addDrawerStatus, table]
  );

  // Handle edit button click
  const handleOnEdit = useCallback(
    async (event, rowData) => {
      event.stopPropagation();
      setEditDrawerStatus({
        ...editDrawerStatus,
        open: true,
        payload: rowData.getAllCells(),
      });
    },
    [editDrawerStatus]
  );

  // Handle delete button click
  const handleOnDelete = useCallback(
    async (event, rowData) => {
      event.stopPropagation();
      const response = await onDelete(rowData?.id);
      if (response.length) {
        // Display confirmation message if the request was successful
        dispatch({ type: SNACKBAR_ACTIONS.DELETE, payload: response });
      } else {
        // Display error message if the request failed
        dispatch({ type: SNACKBAR_ACTIONS.DELETE_ERROR, payload: response });
      }
    },
    [onDelete]
  );

  // Handle submit AddDrawer form
  const handleOnAddSubmit = useCallback(() => {
    console.log("handleOnAddSubmit");
  }, []);

  const AddDrawer = useMemo(
    () => (
      <TableDrawer
        drawerOpen={addDrawerStatus.open}
        itemData={addDrawerStatus.payload}
        onSubmit={(formData) => handleOnAddSubmit(formData)}
        onClose={() => setAddDrawerStatus(initialDrawerStatus)}
        edit={addDrawerStatus.edit}
      />
    ),
    [addDrawerStatus, initialDrawerStatus, handleOnAddSubmit]
  );

  // Filters section
  const enabledFilters = useMemo(() => {
    const filteredColumns = table
      .getFlatHeaders()
      .filter((header) => header.column.getCanFilter());
    const arr = [...filteredColumns].map((header) => ({
      id: header.id,
      label: header.column.columnDef.header(),
    }));
    return arr;
  }, [table]);

  const addItemButton = useMemo(
    () => (
      <Button
        variant="contained"
        sx={{ marginLeft: "auto", height: "fit-content" }}
        onClick={handleOnAdd}
      >
        New Item
      </Button>
    ),
    [handleOnAdd]
  );

  const Filters = useMemo(
    () => (
      <TableFilters
        filters={enabledFilters}
        onFiltersSubmit={(filters) => setColumnFilters(filters)}
        onFiltersReset={() => setColumnFilters([])}
        globalSearch={globalSearch}
        onGlobalSearch={(value) => setGlobalFilter(value)}
      >
        {addItemButton}
      </TableFilters>
    ),
    [enabledFilters, globalSearch, addItemButton]
  );

  // Display skeleton rows on loading
  const SkeletonTable = useMemo(
    () => (
      <>
        {[...Array(table.getState().pagination.pageSize)].map((_, index) => (
          <TableRow key={index}>
            {[...Array(table.getFlatHeaders().length)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    ),
    [table]
  );

  // Handle submit EditDrawer form
  const handleOnEditSubmit = useCallback(
    async (formData) => {
      const itemTitle = await onEdit(formData);
      setEditDrawerStatus(initialDrawerStatus);
      if (itemTitle.length) {
        // Display confirmation message if the request was successful
        dispatch({ type: SNACKBAR_ACTIONS.EDIT, payload: itemTitle });
      } else {
        // Display error message if the request failed
        console.error(
          `Error while editing the item: ${itemTitle?.status ?? ""} ${
            itemTitle?.statusText ?? ""
          }`
        );
        dispatch({ type: SNACKBAR_ACTIONS.EDIT_ERROR, payload: itemTitle });
      }
    },
    [onEdit, initialDrawerStatus]
  );

  const EditDrawer = useMemo(
    () => (
      <TableDrawer
        drawerOpen={editDrawerStatus.open}
        itemData={editDrawerStatus.payload}
        onSubmit={(formData) => handleOnEditSubmit(formData)}
        onClose={() => setEditDrawerStatus(initialDrawerStatus)}
        edit={editDrawerStatus.edit}
      />
    ),
    [editDrawerStatus, initialDrawerStatus, handleOnEditSubmit]
  );

  return (
    <>
      {Filters}
      <Divider />
      <Paper>
        <TableContainer>
          <Table
            xs={{ minWidth: `${minWidth ?? "auto"}` }}
            size={
              // Automatically set table padding based on screen width
              useMediaQuery("(min-width:600px)") ? "medium" : "small"
            }
          >
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      align="center"
                      sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                    >
                      <TableSortLabel
                        active={sorting[0]?.id === header.id}
                        hideSortIcon
                        direction={
                          header.column.getIsSorted() === "desc"
                            ? "desc"
                            : "asc"
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && <TableCell />}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {loading && !data && SkeletonTable}
              {!loading &&
                (error ? (
                  <TableRow>
                    <TableCell colSpan={table.getFlatHeaders().length}>
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Sorry, an error occurred while getting the data.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : !data?.length ? (
                  <TableRow>
                    <TableCell colSpan={table.getFlatHeaders().length}>
                      <Alert severity="info">
                        <AlertTitle>No Data</AlertTitle>
                        No records available.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : table.getPrePaginationRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      hover={clickable}
                      sx={{ cursor: clickable ? "pointer" : "default" }}
                      onClick={(event) => onRowClick(event, row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          align={cell.column.columnDef.align ?? "center"}
                          sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: {
                              xs: "8rem",
                              sm: "9rem",
                              md: "10rem",
                              lg: "12rem",
                              xl: "15rem",
                            },
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell
                          sx={{ whiteSpace: "nowrap", textAlign: "right" }}
                        >
                          {onEdit && (
                            <Tooltip
                              title="Edit"
                              onClick={(event) => handleOnEdit(event, row)}
                            >
                              <IconButton>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip
                              title="Delete"
                              onClick={(event) =>
                                handleOnDelete(event, row.original)
                              }
                            >
                              <IconButton>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getFlatHeaders().length}>
                      <Alert severity="info">
                        <AlertTitle>No Results Found</AlertTitle>
                        Sorry, no items match your search. Please try again with
                        a different query.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={table.getPrePaginationRowModel().rows?.length ?? 0}
          page={table.getState().pagination.pageIndex}
          rowsPerPage={table.getState().pagination.pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
        <TableSnackbar
          openSnackbar={snackbarState}
          onClose={() => dispatch({ type: SNACKBAR_ACTIONS.CLOSE })}
        />
      </Paper>
      {AddDrawer}
      {onEdit && EditDrawer}
    </>
  );
};

DataTable.propTypes = {
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  rowsPerPageOptions: PropTypes.array,
  orderBy: PropTypes.string,
  globalSearch: PropTypes.bool,
  defaultOrder: PropTypes.bool,
  clickable: PropTypes.bool,
  onRowClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DataTable;
