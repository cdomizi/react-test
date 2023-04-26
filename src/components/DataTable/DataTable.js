import PropTypes from "prop-types";
import { useMemo, useCallback, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import TableFilters from "./TableFilters";
import TableDrawer from "./TableDrawer";

// mui components
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
  Snackbar,
} from "@mui/material";

// mui icons
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

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

  // global filter
  const [globalFilter, setGlobalFilter] = useState("");

  // column filter
  const [columnFilters, setColumnFilters] = useState([]);

  const initialDrawerStatus = useMemo(
    () => ({ open: false, payload: null }),
    []
  );

  // EditDrawer status
  const [editDrawerStatus, setEditDrawerStatus] = useState({
    ...initialDrawerStatus,
  });

  // snackbar status
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    success: true,
    message: null,
  });

  const hiddenColumns = columns.reduce(
    (obj, column) => ({
      ...obj,
      [column.accessorKey]: column.isVisible ?? true,
    }),
    {}
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

  // handle edit button click
  const handleOnEdit = useCallback(
    (event, row) => {
      event.stopPropagation();
      setEditDrawerStatus({
        ...editDrawerStatus,
        open: true,
        payload: row.getAllCells(),
      });
    },
    [editDrawerStatus]
  );

  // handle delete button click
  const handleOnDelete = useCallback(
    async (event, rowData) => {
      event.stopPropagation();
      const response = await onDelete(rowData?.id);
      if (response.length) {
        // display confirmation message if the request was successful
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          success: true,
          message: `${response || "Item"} deleted successfully!`,
        });
      } else {
        // display error message if the request failed
        console.error(
          `Error while deleting the item: ${response?.status ?? ""} ${
            response?.statusText ?? ""
          }`
        );
        setOpenSnackbar({
          ...openSnackbar,
          open: true,
          success: false,
          message: `Sorry! Unable to delete the item.`,
        });
      }
    },
    [onDelete, openSnackbar]
  );

  // filters section
  const filteredColumns = table
    .getFlatHeaders()
    .filter((header) => header.column.getCanFilter());
  const enabledFilters = useMemo(() => [], []);
  filteredColumns.forEach((header) =>
    enabledFilters.push({
      id: header.id,
      label: header.column.columnDef.header(),
    })
  );
  const Filters = useMemo(
    () => (
      <TableFilters
        filters={enabledFilters}
        onFiltersSubmit={(filters) => setColumnFilters(filters)}
        onFiltersReset={() => setColumnFilters([])}
        globalSearch={globalSearch}
        onGlobalSearch={(value) => setGlobalFilter(value)}
      />
    ),
    [enabledFilters, globalSearch]
  );

  // display skeleton rows on loading
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

  const EditDrawer = useMemo(
    () => (
      <TableDrawer
        drawerOpen={editDrawerStatus.open}
        itemData={editDrawerStatus.payload}
        onSubmit={(payload) => {
          onEdit(payload);
          setEditDrawerStatus(initialDrawerStatus);
        }}
        onClose={() => setEditDrawerStatus(initialDrawerStatus)}
      />
    ),
    [editDrawerStatus, initialDrawerStatus, onEdit]
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
              // automatically set table padding based on screen width
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
        <Snackbar
          open={openSnackbar.open}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: openSnackbar.vertical,
            horizontal: openSnackbar.horizontal,
          }}
          onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
        >
          <Alert
            onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
            severity={openSnackbar.success ? "success" : "error"}
          >
            {openSnackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
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
