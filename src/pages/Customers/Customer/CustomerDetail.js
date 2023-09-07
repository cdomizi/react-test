import { useCallback, useContext, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Project import
import { handleEditCustomer, customerSchema } from "../CustomerActions";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import getRandomInt from "../../../utils/getRandomInt";
import { formatLabel } from "../../../utils/formatStrings";
import OrdersSection from "./OrdersSection";
import CustomerDetailSkeleton from "./CustomerDetailSkeleton";
import CustomDivider from "../../../components/CustomDivider";

// MUI components
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// MUI icons
import { Edit as EditIcon } from "@mui/icons-material";

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

  const dispatch = useContext(SnackbarContext);

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    reset,
  } = useForm({
    defaultValues: data,
    resolver: yupResolver(customerSchema),
  });

  const onSubmit = useCallback(
    async (formData) => {
      const response = await handleEditCustomer(formData);
      if (response?.length) {
        // Display confirmation message if the request was successful
        dispatch({
          type: SNACKBAR_ACTIONS.EDIT,
          payload: response,
          dataName: dataName?.singular,
        });
        // Force refetch to get updated data
        reload();
      } else {
        console.error(response);
        // Check if it's a unique field error
        response?.field
          ? // Display the specific error message
            dispatch({
              type: SNACKBAR_ACTIONS.UNIQUE_FIELD_ERROR,
              payload: response,
              dataName: dataName?.singular,
            })
          : // Display a generic error message
            dispatch({
              type: SNACKBAR_ACTIONS.EDIT_ERROR,
              payload: response,
              dataName: dataName?.singular,
            });
      }
      setEdit(false);
    },
    [dataName?.singular, dispatch, reload]
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
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    {...fieldProps}
                    id={key}
                    label={key}
                    inputRef={ref}
                    InputLabelProps={{ shrink: true }}
                    disabled={
                      isLoading || isSubmitting || randomLoading || loading
                    }
                    inputProps={{ readOnly: !edit }}
                    InputProps={{
                      ...fieldProps?.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ||
                          isSubmitting ||
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
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    {...fieldProps}
                    id={formatLabel(key)}
                    label={formatLabel(key)}
                    inputRef={ref}
                    InputLabelProps={{ shrink: true }}
                    disabled={
                      isLoading || isSubmitting || randomLoading || loading
                    }
                    inputProps={{ readOnly: !edit }}
                    InputProps={{
                      ...fieldProps?.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ||
                          isSubmitting ||
                          randomLoading ||
                          loading ? (
                            <InputAdornment position="end">
                              <CircularProgress color="inherit" size={20} />
                            </InputAdornment>
                          ) : null}
                        </>
                      ),
                    }}
                    error={!!errors[key]}
                    helperText={errors[key] && errors[key]?.message}
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
      errors,
      isLoading,
      isSubmitting,
      loading,
      randomLoading,
    ]
  );

  return loading ? (
    <CustomerDetailSkeleton />
  ) : (
    <Box>
      <Typography variant="h2" mb="3rem">{`Customer #${data?.id}`}</Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing="3.5rem"
        useFlexGap
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} width={{ xs: "18rem", md: "22rem" }}>
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
                    isLoading || isSubmitting || randomLoading || loading
                  }
                  endIcon={
                    (isLoading || isSubmitting || randomLoading || loading) && (
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
                      reset();
                      setEdit(false);
                    }}
                  >
                    Cancel
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
        <CustomDivider
          sx={{
            display: error ? "none" : "block",
            px: { md: 1 },
          }}
        />
        {(!error && <OrdersSection data={data} />) ?? null}
      </Stack>
    </Box>
  );
};

export default CustomerDetail;
