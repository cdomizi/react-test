import { useState, useMemo, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";

// MUI components
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Skeleton,
  Stack,
  TextField,
  Typography,
  capitalize,
} from "@mui/material";

// MUI icons
import {
  Circle as CircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const CustomerDetail = ({ loading, error, data }) => {
  const [edit, setEdit] = useState(false);

  const { control, handleSubmit } = useForm({ defaultValues: data });

  const onSubmit = useCallback(
    (formData) => {
      console.log(formData);
      setEdit(false);
    },
    [setEdit]
  );

  const CustomerSkeleton = useMemo(
    () => (
      <>
        <Skeleton
          variant="text"
          sx={{ fontSize: "5rem", maxWidth: "32rem", marginBottom: "2rem" }}
        />
        <Stack direction="row" spacing={3}>
          <Stack width="20rem">
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "12rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "12rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "12rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "3rem", maxWidth: "12rem" }}
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
              sx={{ fontSize: "1rem", maxWidth: "8rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "8rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "8rem" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem", maxWidth: "8rem" }}
            />
          </Stack>
        </Stack>
      </>
    ),
    []
  );

  const formatLabel = useCallback((label) => {
    const split = label.split(/(?=[A-Z])|(?<=[A-Z])/g);

    return capitalize(split[0]) + " " + split.slice(1).join("");
  }, []);

  // Customer Details section
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
                    inputProps={{ readOnly: edit }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ display: "none" }}
                    margin="normal"
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
                    id={key}
                    label={formatLabel(key)}
                    inputProps={{ readOnly: !edit }}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                )}
              />
            );
        }
      }),
    [control, data, edit, formatLabel]
  );

  // Format order
  const getOrderDate = useCallback(
    (date) => moment(date).format("MMMM Do YYYY"),
    []
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
                <strong>{`${getOrderDate(order.createdAt)}`}</strong>
              </ListItem>
            ))}
          </List>
        ) : (
          "No orders"
        )}
      </Box>
    ),
    [data?.id, data?.firstName, data?.lastName, data?.orders, getOrderDate]
  );

  return loading ? (
    CustomerSkeleton
  ) : (
    <Box>
      <Typography variant="h2" mb="3rem">{`Customer #${data?.id}`}</Typography>
      <Stack direction="row" spacing="2rem">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
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
                  onClick={(event) => {
                    event.preventDefault();
                    console.log("fill with random data");
                  }}
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
              <Stack direction="row" spacing={2}>
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
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  fullWidth
                  endIcon={<DeleteIcon />}
                  color="error"
                  onClick={(event) => {
                    event.preventDefault();
                    console.log("delete customer");
                  }}
                  sx={{
                    "&, & .MuiButtonBase-root": { alignItems: "normal" },
                  }}
                >
                  Delete
                </Button>
              </Stack>
            )}
          </Stack>
        </form>
        <Divider orientation="vertical" flexItem />
        {(!error && CustomerOrders) ?? null}
      </Stack>
    </Box>
  );
};

export default CustomerDetail;
