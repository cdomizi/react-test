import { useCallback, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";

// Project import
import publicApi from "../../api/axios";
import AuthContext from "../../contexts/AuthContext";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../contexts/SnackbarContext";
import CustomSnackbar from "../../components/CustomSnackbar";

// MUI components
const {
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} = require("@mui/material");

const Register = () => {
  const navigate = useNavigate();

  const { setAuth } = useContext(AuthContext);

  const { dispatch } = useContext(SnackbarContext);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
    reset,
  } = useForm({
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const onSubmit = useCallback(
    async (formData) => {
      try {
        const response = await publicApi.post(
          "users",
          JSON.stringify(formData),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update auth context with login response data
        const { accessToken, id, username, isAdmin } = response.data;
        setAuth({
          id,
          username,
          isAdmin,
          accessToken,
        });

        // On successful registration, notify the user
        dispatch({
          type: SNACKBAR_ACTIONS.REGISTER_SUCCESS,
          payload: { username: username },
        });

        navigate("/");
        return;
      } catch (err) {
        // On failed registration, notify the user
        dispatch({
          type: SNACKBAR_ACTIONS.REGISTER_ERROR,
          payload: {
            status: err.response?.status,
            statusText: err.response?.statusText,
            error: err,
            user: formData.username,
          },
        });
      }
    },
    [dispatch, navigate, setAuth]
  );

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <Box sx={{ maxWidth: "24rem", mx: "auto", mt: 6 }}>
      <Stack
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="register-form"
        spacing={3}
        autoComplete="off"
      >
        <Typography variant="h2" mx="auto">
          Register
        </Typography>
        <Controller
          control={control}
          name="username"
          rules={{
            required: "Please enter your username",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              id="username"
              label="Username"
              error={!!errors?.username}
              helperText={errors?.username && errors?.username?.message}
              InputLabelProps={{ required: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Please enter your password",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              id="password"
              label="Password"
              type="password"
              error={!!errors?.password}
              helperText={errors?.password && errors?.password?.message}
              InputLabelProps={{ required: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Please confirm your password",
            validate: (val) =>
              val === watch("password") || "Passwords do not match",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              error={!!errors?.confirmPassword}
              helperText={
                errors?.confirmPassword && errors?.confirmPassword?.message
              }
              InputLabelProps={{ required: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="contained">
          Register
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>
        <Typography color="text.disabled">Already have an account?</Typography>
      </Divider>
      <Button onClick={() => navigate("/login")} variant="outlined" fullWidth>
        Log in
      </Button>
      <CustomSnackbar />
    </Box>
  );
};

export default Register;
