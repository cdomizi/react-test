import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
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
} from "@mui/material";

const DataTable = (props) => {
  const { minWidth, data, columns, loading, error } = props;
  const [visibleRows, setVisibleRows] = useState(data || null);
  const [page, setPage] = useState(0);
  const defaultRowsPerPage = 10;
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // only show the first 10 rows by default
  useEffect(() => {
    const initialRows = data?.slice(0, 10) || 0;
    setVisibleRows(initialRows);
  }, [data]);

  const handleChangePage = useCallback(
    (event, newPage) => {
      setPage(newPage);
      const updatedRows = data.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);
    },
    [data, rowsPerPage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);
      setPage(0);
      const updatedRows = data.slice(0, updatedRowsPerPage);

      setVisibleRows(updatedRows);
    },
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // display skeleton rows on loading
  const SkeletonTable = useMemo(
    () => (
      <>
        {[...Array(defaultRowsPerPage)].map((_, index) => (
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
    <Paper>
      <TableContainer>
        <Table
          xs={{ minWidth: `${minWidth || "auto"}` }}
          size={useMediaQuery("(min-width:600px)") ? "medium" : "small"}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading ? (
              SkeletonTable
            ) : visibleRows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={table.getFlatHeaders().length}>
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Sorry, an error occurred while loading the data.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={table.getFlatHeaders().length}>
                  <Alert severity="info">
                    <AlertTitle>No Data</AlertTitle>
                    No records available.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
