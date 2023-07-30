import { useCallback, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Project import
import { handleEditCustomer } from "../CustomerActions";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import CustomSnackbar from "../../../components/CustomSnackbar";
import getRandomInt from "../../../utils/getRandomInt";
import { formatLabel, formatOrderDate } from "../../../utils/formatStrings";

// MUI components
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// MUI icons
import { Circle as CircleIcon, Edit as EditIcon } from "@mui/icons-material";

const CustomerDetail = ({
  loading,
  error,
  data,
  dataName,
  randomData,
  reload = null,
}) => {
  const [edit, setEdit] = useState(false);

  // Loading state for setRandomData
  const [randomLoading, setRandomLoading] = useState(false);

  // State and dispatch function for snackbar component
  const [snackbarState, dispatch] = useContext(SnackbarContext);

  // Set the `dataName` property for the snackbar
  snackbarState.dataName = dataName?.singular;

  const { control, handleSubmit, formState, reset } = useForm({
    defaultValues: data,
  });

  const onSubmit = useCallback(
    async (formData) => {
      const response = await handleEditCustomer(formData);
      if (response?.length) {
        // Display confirmation message if the request was successful
        dispatch({ type: SNACKBAR_ACTIONS.EDIT, payload: response });
        // Force refetch to get updated data
        reload();
      } else {
        // Check if it's a unique field error
        response?.field
          ? // Display the specific error message
            dispatch({
              type: SNACKBAR_ACTIONS.UNIQUE_FIELD_ERROR,
              payload: response,
            })
          : // Display a generic error message
            dispatch({
              type: SNACKBAR_ACTIONS.EDIT_ERROR,
              payload: response,
            });
      }
      setEdit(false);
    },
    [dispatch, reload]
  );

  // Fill with random data
  const setRandomData = useCallback(async () => {
    const randomItemId = getRandomInt(10);
    try {
      // Disable "Fill with random data" button
      setRandomLoading(true);
      const response = await fetch(`${randomData?.url}/${randomItemId}`, {});
      const randomItemData = await response.json();

      if (response.ok) {
        // Delete ID property if exists
        randomItemData.id && delete randomItemData.id;
        reset(randomItemData, { keepDefaultValues: true });
      }
    } catch (error) {
      throw new Error(error?.message);
    } finally {
      setRandomLoading(false);
    }
  }, [randomData?.url, reset]);

  const CustomerSkeleton = useMemo(
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

  // Customer details section
  const FormDetails = useMemo(
    () =>
      data &&
      Object.keys(data)?.map((key, index) => {
        switch (key) {
          case "id":
            return (
              <Controller
                key={index}
                control={control}
                name={key}
                defaultValue={data[key]}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={key}
                    label={key}
                    inputRef={field.ref}
                    InputLabelProps={{ shrink: true }}
                    disabled={
                      formState.isLoading ||
                      formState.isSubmitting ||
                      randomLoading ||
                      loading
                    }
                    inputProps={{ readOnly: !edit }}
                    InputProps={{
                      ...field?.InputProps,
                      endAdornment: (
                        <>
                          {formState.isLoading ||
                          formState.isSubmitting ||
                          randomLoading ||
                          loading ? (
                            <InputAdornment position="end">
                              <CircularProgress color="inherit" size={20} />
                            </InputAdornment>
                          ) : null}
                        </>
                      ),
                    }}
                    sx={{ display: "none" }}
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            );
          case "orders":
            return null;
          default:
            return (
              <Controller
                key={index}
                control={control}
                name={key}
                defaultValue={data[key]}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={formatLabel(key)}
                    label={formatLabel(key)}
                    InputLabelProps={{ shrink: true }}
                    disabled={
                      formState.isLoading ||
                      formState.isSubmitting ||
                      randomLoading ||
                      loading
                    }
                    inputProps={{ readOnly: !edit }}
                    InputProps={{
                      ...field?.InputProps,
                      endAdornment: (
                        <>
                          {formState.isLoading ||
                          formState.isSubmitting ||
                          randomLoading ||
                          loading ? (
                            <InputAdornment position="end">
                              <CircularProgress color="inherit" size={20} />
                            </InputAdornment>
                          ) : null}
                        </>
                      ),
                    }}
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            );
        }
      }),
    [
      control,
      data,
      edit,
      formState.isLoading,
      formState.isSubmitting,
      loading,
      randomLoading,
    ]
  );

  // Customer orders section
  const CustomerOrders = useMemo(
    () => (
      <Box>
        <Typography variant="h5" mb={3}>
          Orders by{" "}
          {data?.firstName && data?.lastName
            ? `${data.firstName} ${data.lastName}`
            : `Customer ${data?.id}`}
          :
        </Typography>
        {data?.orders?.length ? (
          <List>
            {data.orders.map((order) => (
              <ListItem key={order.id} sx={{ display: "block" }}>
                <ListItemIcon
                  sx={{
                    "&, & .MuiListItemIcon-root": { minWidth: "2rem" },
                    verticalAlign: "sub",
                  }}
                >
                  <CircleIcon fontSize="small" />
                </ListItemIcon>
                {`#${order.id} on `}
                <Box component="span" fontWeight="bold">
                  {`${formatOrderDate(order.createdAt)}`}
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          "No orders"
        )}
      </Box>
    ),
    [data?.id, data?.firstName, data?.lastName, data?.orders]
  );

  return loading ? (
    CustomerSkeleton
  ) : (
    <Box>
      <Typography variant="h2" mb="3rem">{`Customer #${data?.id}`}</Typography>
      <Stack direction="row" spacing="2rem">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  disabled={
                    formState.isLoading ||
                    formState.isSubmitting ||
                    randomLoading ||
                    loading
                  }
                  endIcon={
                    (formState.isLoading ||
                      formState.isSubmitting ||
                      randomLoading ||
                      loading) && <CircularProgress color="inherit" size={20} />
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
        {(!error && CustomerOrders) ?? null}
      </Stack>
      <CustomSnackbar {...snackbarState} />
    </Box>
  );
};

export default CustomerDetail;
