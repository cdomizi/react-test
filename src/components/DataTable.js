import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Skeleton,
  Alert,
  AlertTitle,
} from "@mui/material";

const DataTable = (props) => {
  const { minWidth, headers, data, loading, pagination } = props;
  const SkeletonTable = () => {
    return [...Array(pagination.limit)].map((_) => (
      <TableRow>
        {[...Array(headers.length)].map((_) => (
          <TableCell>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <TableContainer component={Paper}>
      <Table xs={{ minWidth: `${minWidth || "auto"}` }}>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            SkeletonTable()
          ) : data ? (
            data.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row)
                  .filter((item) => !item.hidden)
                  .map((item, index) => (
                    <TableCell key={index}>{`${item.value}`}</TableCell>
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
  );
};

export default DataTable;
