import { useRouteError } from "react-router-dom";

// mui components
import { Box, Typography } from "@mui/material";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Box p={3}>
      <Typography variant="h2" gutterBottom>
        {`${error.status}: ${error.statusText}`}
      </Typography>
      <Typography>{`${error.data && error.data}`}</Typography>
    </Box>
  );
}

export default ErrorPage;
