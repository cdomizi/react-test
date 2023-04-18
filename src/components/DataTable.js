import PropTypes from "prop-types";
import { useMemo, useCallback, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

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
  Skeleton,
  Alert,
  AlertTitle,
  useMediaQuery,
  TableSortLabel,
} from "@mui/material";

const DataTable = (props) => {
  const {
    minWidth,
    data,
    columns,
    loading,
    error,
    defaultRowsPerPage = 10,
    rowsPerPageOptions = [5, 10, 25],
    orderBy = null,
    searchFilters,
    defaultOrder = false,
    clickable = false,
    onRowClick = null,
  } = props;

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultRowsPerPage,
  });

  const defaultSorting = [{ id: orderBy, desc: defaultOrder }];
  const [sorting, setSorting] = useState(defaultSorting ?? []);

  // global filter
  const [globalFilter, setGlobalFilter] = useState("");
  useEffect(() => setGlobalFilter(searchFilters), [searchFilters]);

  const [visibleRows, setVisibleRows] = useState(null);

  // set default rows per page when first rendering the table
  useEffect(() => {
    const initialRows = data?.slice(0, defaultRowsPerPage);
    setVisibleRows(initialRows);
  }, [data, defaultRowsPerPage]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: visibleRows ?? [],
    columns,
    pageCount: data?.length ?? -1,
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handlePageChange = useCallback(
    (event, newPage) => {
      table.setPageIndex(newPage);
      const updatedRows = data.slice(
        newPage * pageSize,
        newPage * pageSize + pageSize
      );

      setVisibleRows(updatedRows);
    },
    [table, data, pageSize]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      table.setPageSize(newRowsPerPage);
      const updatedRows = data?.slice(
        0 * newRowsPerPage,
        0 * newRowsPerPage + newRowsPerPage
      );

      setVisibleRows(updatedRows);
    },
    [table, data]
  );

  // display skeleton rows on loading
  const SkeletonTable = useMemo(
    () => (
      <>
        {[...Array(pageSize)].map((_, index) => (
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
    [table, pageSize]
  );

  return (
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
                        header.column.getIsSorted() === "desc" ? "desc" : "asc"
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
              ) : (
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
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data?.length ?? 0}
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
};

DataTable.propTypes = {
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  defaultRowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  orderBy: PropTypes.string,
  searchFilters: PropTypes.string,
  defaultOrder: PropTypes.bool,
  clickable: PropTypes.bool,
  onRowClick: PropTypes.func,
};

export default DataTable;
