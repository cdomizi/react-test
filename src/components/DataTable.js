import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

const DataTable = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table xs={{ minWidth: `${props?.minWidth}` }}>
        <TableHead>
          <TableRow>
            {props.headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data ? (
            props.data.map((row, index) => (
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
              <TableCell colSpan={props.headers.length}>No Data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
