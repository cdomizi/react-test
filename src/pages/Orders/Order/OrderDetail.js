import { useCallback, useContext, useMemo, useState } from "react";

// Project import
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import CustomSnackbar from "../../../components/CustomSnackbar";

// Mui components
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

// MUI icons
import { Edit as EditIcon } from "@mui/icons-material";

const OrderDetail = ({ loading, error, data, dataName, reload = null }) => {
  const [edit, setEdit] = useState(false);

  // Loading state for setRandomData
  const [randomLoading, setRandomLoading] = useState(false);

  // State and dispatch function for snackbar component
  const [snackbarState, dispatch] = useContext(SnackbarContext);

  // Set the `dataName` property for the snackbar
  snackbarState.dataName = dataName?.singular;

  // Fill with random data
  const setRandomData = useCallback(async () => {
    try {
      setRandomLoading(true);
      console.log("fill with random data");
    } catch (error) {
      throw new Error(error?.message);
    } finally {
      setRandomLoading(false);
    }
  }, []);

  const OrderSkeleton = useMemo(
    () => (
      <>
        <Skeleton
          variant="text"
          sx={{ fontSize: "5rem", maxWidth: "26rem", marginBottom: "2rem" }}
        />
        <Stack direction="row" spacing={2}>
          <Stack width="20rem">
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "16rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "7rem" }}
            />
          </Stack>
          <Stack width="20rem" spacing={2}>
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "12rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "10rem" }}
            />
          </Stack>
        </Stack>
      </>
    ),
    []
  );

  // Order details section
  const FormDetails = useMemo(
    () =>
      data && (
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    [data]
  );

  // Invoice section
  const OrderInvoice = useMemo(
    () => (
      <Box>
        <Typography variant="h5" mb={3}>
          {data?.invoice ? `Invoice data for order #${data?.id}` : "No invoice"}
        </Typography>
      </Box>
    ),
    [data?.id, data?.invoice]
  );

  return loading ? (
    OrderSkeleton
  ) : (
    <Box>
      <Typography variant="h2" mb="3rem">{`Order #${data?.id}`}</Typography>
      <Stack direction="row" spacing="2rem">
        <form onSubmit={null}>
          <Stack spacing={2} width="18rem">
            {error ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                Sorry, an error occurred while getting customer's data.
              </Alert>
            ) : (
              FormDetails
            )}
            {edit ? (
              <>
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={setRandomData}
                  disabled={randomLoading || loading}
                  endIcon={
                    (randomLoading || loading) && (
                      <CircularProgress color="inherit" size={20} />
                    )
                  }
                >
                  Fill with random data
                </Button>
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={(event) => {
                      event.preventDefault();
                      setEdit(false);
                    }}
                  >
                    Undo
                  </Button>
                </Stack>
              </>
            ) : (
              <Button
                type="button"
                variant="outlined"
                size="large"
                fullWidth
                endIcon={<EditIcon />}
                onClick={(event) => {
                  event.preventDefault();
                  setEdit(true);
                }}
                sx={{
                  "&, & .MuiButtonBase-root": { alignItems: "normal" },
                }}
              >
                Edit
              </Button>
            )}
          </Stack>
        </form>
        <Divider orientation="vertical" flexItem />
        {(!error && OrderInvoice) ?? null}
      </Stack>
      <CustomSnackbar {...snackbarState} />
    </Box>
  );
};

export default OrderDetail;
