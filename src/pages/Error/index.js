import { useRouteError } from "react-router-dom";

// mui components
import { Box, Button, Typography } from "@mui/material";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Box p={6}>
      <Typography variant="h2" gutterBottom>
        {(error.status && `${error.status}`) || "Unexpected Error"}
        {error.statusText && `: ${error.statusText}`}
      </Typography>
      <Typography>{`${error.data}` || "Sorry, an error occurred."}</Typography>
      <Box sx={{ width: "100%", height: "100%", textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          sx={{ marginTop: "20%" }}
          href="/"
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}

export default ErrorPage;
