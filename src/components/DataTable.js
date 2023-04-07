import { useState, useMemo, useCallback, useEffect } from "react";

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
  const { minWidth, headers, data, loading } = props;
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

  // display skeleton rows on loading
  const SkeletonTable = useMemo(
    () => (
      <>
        {[...Array(defaultRowsPerPage)].map((_, index) => (
          <TableRow key={index}>
            {[...Array(headers.length)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    ),
    [headers]
  );

  return (
    <Paper>
      <TableContainer>
        <Table
          xs={{ minWidth: `${minWidth || "auto"}` }}
          size={useMediaQuery("(min-width:600px)") ? "medium" : "small"}
        >
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index}>
                  <strong>{header}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              SkeletonTable
            ) : visibleRows ? (
              visibleRows.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row)
                    .filter((item) => !item.hidden)
                    .map((item, index) => (
                      <TableCell key={index}>{item.value}</TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length}>
                  <Alert severity="info">
                    <AlertTitle>No Data</AlertTitle>
                    There are no records available.
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