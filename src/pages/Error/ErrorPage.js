import { useRouteError } from "react-router-dom";

// mui components
import { Box, Typography } from "@mui/material";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Box p={3}>
      <Typography variant="h2" gutterBottom>
        {(error.status && `${error.status}`) || "Unexpected Error"}
        {error.statusText && `: ${error.statusText}`}
      </Typography>
      <Typography>{`${error.data || `Sorry, an error occurred.`}`}</Typography>
    </Box>
  );
}

export default ErrorPage;
