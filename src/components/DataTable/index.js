import PropTypes from "prop-types";
import { useMemo, useCallback, useContext, useState } from "react";
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
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../contexts/SnackbarContext";

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
  Box,
} from "@mui/material";

// MUI icons
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

const DataTable = (props) => {
  const {
    sx = {},
    data,
    dataName = null,
    columns,
    loading,
    error,
    rowsPerPageOptions = [5, 10, 25],
    orderBy = null,
    globalSearch = false,
    defaultOrder = false,
    clickable = false,
    reload = null,
    onRowClick = null,
    onCreate = null,
    onEdit = null,
    onDelete = null,
    validation = null,
    randomData = null,
    customDrawer: CustomDrawer = null,
  } = props;

  const dispatch = useContext(SnackbarContext);

  const defaultSorting = [{ id: orderBy, desc: defaultOrder }];
  const [sorting, setSorting] = useState(defaultSorting ?? []);

  // Global filter
  const [globalFilter, setGlobalFilter] = useState("");

  // Column filter
  const [columnFilters, setColumnFilters] = useState([]);

  const initialDrawerState = useMemo(
    () => ({ open: false, payload: null, edit: false }),
    []
  );

  // Table drawer state
  const [drawerState, setDrawerState] = useState(initialDrawerState);

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

  // Handle create button click
  const handleOnCreate = useCallback(
    async (event) => {
      event.stopPropagation();
      setDrawerState({
        ...drawerState,
        open: true,
        edit: false,
        payload: table.getAllFlatColumns(),
      });
    },
    [drawerState, table]
  );

  // Handle edit button click
  const handleOnEdit = useCallback(
    async (event, rowData) => {
      event.stopPropagation();
      setDrawerState({
        ...drawerState,
        open: true,
        edit: true,
        payload: rowData.getAllCells(),
      });
    },
    [drawerState]
  );

  // Handle delete button click
  const handleOnDelete = useCallback(
    async (event, rowData) => {
      event.stopPropagation();
      const response = await onDelete(rowData?.id);
      if (response?.length) {
        // Display confirmation message if the request was successful
        dispatch({
          type: SNACKBAR_ACTIONS.DELETE,
          payload: response,
          dataName: dataName?.singular,
        });
        // Force refetch to get updated data
        reload && reload();
      } else {
        // Display error message if the request failed
        dispatch({
          type: SNACKBAR_ACTIONS.DELETE_ERROR,
          payload: response,
          dataName: dataName?.singular,
        });
      }
    },
    [onDelete, dispatch, dataName?.singular, reload]
  );

  // Handle submit CreateDrawer form
  const handleOnCreateSubmit = useCallback(
    async (formData) => {
      const response = await onCreate(formData);
      setDrawerState(initialDrawerState);
      if (typeof response === "string") {
        // Display confirmation message if the request was successful
        dispatch({
          type: SNACKBAR_ACTIONS.CREATE,
          payload: response,
          dataName: dataName?.singular,
        });
        // Force refetch to get updated data
        reload && reload();
      } else {
        // Check if it's a unique field error
        response?.field
          ? // Display the specific error message
            dispatch({
              type: SNACKBAR_ACTIONS.UNIQUE_FIELD_ERROR,
              payload: response,
              dataName: dataName?.singular,
            })
          : // Display a generic error message
            dispatch({
              type: SNACKBAR_ACTIONS.CREATE_ERROR,
              payload: response,
              dataName: dataName?.singular,
            });
      }
    },
    [onCreate, initialDrawerState, dispatch, dataName?.singular, reload]
  );

  // Handle submit EditDrawer form
  const handleOnEditSubmit = useCallback(
    async (formData) => {
      const response = await onEdit(formData);
      setDrawerState(initialDrawerState);
      if (response?.length) {
        // Display confirmation message if the request was successful
        dispatch({
          type: SNACKBAR_ACTIONS.EDIT,
          payload: response,
          dataName: dataName?.singular,
        });
        // Force refetch to get updated data
        reload && reload();
      } else {
        // Check if it's a unique field error
        response?.field
          ? // Display the specific error message
            dispatch({
              type: SNACKBAR_ACTIONS.UNIQUE_FIELD_ERROR,
              payload: response,
              dataName: dataName?.singular,
            })
          : // Display a generic error message
            dispatch({
              type: SNACKBAR_ACTIONS.EDIT_ERROR,
              payload: response,
              dataName: dataName?.singular,
            });
      }
    },
    [onEdit, initialDrawerState, dispatch, dataName?.singular, reload]
  );

  // Conditionally render CustomDrawer if provided as props
  const CreateDrawer = useMemo(
    () =>
      CustomDrawer ? (
        <CustomDrawer
          drawerOpen={drawerState.open}
          itemData={drawerState.payload}
          onSubmit={(formData) => handleOnCreateSubmit(formData)}
          onClose={() => setDrawerState(initialDrawerState)}
          edit={drawerState.edit}
          validation={validation}
          dataName={dataName}
        />
      ) : (
        <TableDrawer
          drawerOpen={drawerState.open}
          itemData={drawerState.payload}
          onSubmit={(formData) => handleOnCreateSubmit(formData)}
          onClose={() => setDrawerState(initialDrawerState)}
          edit={drawerState.edit}
          validation={validation}
          dataName={dataName}
          randomData={randomData}
        />
      ),
    [
      CustomDrawer,
      drawerState.open,
      drawerState.payload,
      drawerState.edit,
      validation,
      dataName,
      randomData,
      handleOnCreateSubmit,
      initialDrawerState,
    ]
  );

  // Conditionally render CustomDrawer if provided as props
  const EditDrawer = useMemo(
    () =>
      CustomDrawer ? (
        <CustomDrawer
          drawerOpen={drawerState.open}
          itemData={drawerState.payload}
          onSubmit={(formData) => handleOnEditSubmit(formData)}
          onClose={() => setDrawerState(initialDrawerState)}
          edit={drawerState.edit}
          validation={validation}
          dataName={dataName}
        />
      ) : (
        <TableDrawer
          drawerOpen={drawerState.open}
          itemData={drawerState.payload}
          onSubmit={(formData) => handleOnEditSubmit(formData)}
          onClose={() => setDrawerState(initialDrawerState)}
          edit={drawerState.edit}
          validation={validation}
          dataName={dataName}
          randomData={randomData}
        />
      ),
    [
      CustomDrawer,
      drawerState.open,
      drawerState.payload,
      drawerState.edit,
      validation,
      dataName,
      randomData,
      handleOnEditSubmit,
      initialDrawerState,
    ]
  );

  // Filters section
  const enabledFilters = useMemo(() => {
    const filteredColumns = table
      .getFlatHeaders()
      .filter((header) => header.column.getCanFilter());
    const arr = [...filteredColumns].map((header) => ({
      id: header.id,
      label: header.column.columnDef.header(),
      type: header.column.columnDef?.filterType,
    }));
    return arr;
  }, [table]);

  const createItemButton = useMemo(
    () => (
      <Button
        variant="contained"
        sx={{ ml: "auto", height: "fit-content" }}
        onClick={handleOnCreate}
      >
        {`New ${dataName?.singular ?? "item"}`}
      </Button>
    ),
    [handleOnCreate, dataName]
  );

  const handleFiltersReset = useCallback(() => {
    setColumnFilters([]);
    setGlobalFilter(null);
  }, []);

  const Filters = useMemo(
    () => (
      <TableFilters
        filters={enabledFilters}
        onFiltersSubmit={(filters) => {
          // Set table pagination to 0 to prevent errors
          table.setPageIndex(0);
          setColumnFilters(filters);
        }}
        onFiltersReset={handleFiltersReset}
        globalSearch={globalSearch}
        onGlobalSearch={(value) => {
          // Set table pagination to 0 to prevent errors
          table.setPageIndex(0);
          setGlobalFilter(value);
        }}
      >
        {onCreate && createItemButton}
      </TableFilters>
    ),
    [
      enabledFilters,
      handleFiltersReset,
      globalSearch,
      onCreate,
      createItemButton,
      table,
    ]
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

  return (
    <Box sx={{ minWidth: "auto", ...sx }}>
      {Filters}
      <Divider />
      <Paper>
        <TableContainer>
          <Table
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
                      onClick={(event) => {
                        clickable && onRowClick(event, row.original);
                      }}
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
                        {`Sorry, no ${
                          dataName?.plural ?? "items"
                        } match your search. Please try again with
                        a different query.`}
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
          page={
            table.getPrePaginationRowModel().rows?.length
              ? table.getState().pagination.pageIndex
              : 0
          }
          rowsPerPage={table.getState().pagination.pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
      {drawerState.edit ? EditDrawer : CreateDrawer}
    </Box>
  );
};

DataTable.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
  dataName: PropTypes.object,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  rowsPerPageOptions: PropTypes.array,
  orderBy: PropTypes.string,
  globalSearch: PropTypes.bool,
  defaultOrder: PropTypes.bool,
  clickable: PropTypes.bool,
  reload: PropTypes.func,
  onRowClick: PropTypes.func,
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  validation: PropTypes.object,
  randomData: PropTypes.object,
  customDrawer: PropTypes.func,
};

export default DataTable;
