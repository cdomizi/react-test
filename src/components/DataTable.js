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

  const table = useReactTable({
    data: data ?? [],
    columns,
    pageCount: data?.length ?? -1,
    state: {
      sorting,
      columnFilters,
      globalFilter,
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
  const handleOnEdit = (event, rowData) => {
    event.stopPropagation();
    onEdit(rowData);
  };
  // handle delete button click
  const handleOnDelete = (event, rowData) => {
    event.stopPropagation();
    onDelete(rowData?.id);
  };

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
                  <TableCell />
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
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Tooltip
                          title="Edit"
                          onClick={(event) => handleOnEdit(event, row.original)}
                        >
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
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
                      </TableCell>
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
      </Paper>
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
