import { useCallback, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";

// Project import
import publicApi from "../../api/axios";
import AuthContext from "../../contexts/AuthContext";
import CustomSnackbar from "../../components/CustomSnackbar";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../contexts/SnackbarContext";

// MUI components
const {
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
} = require("@mui/material");

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { setAuth } = useContext(AuthContext);

  // Set up snackbar
  const { snackbarState, dispatch } = useContext(SnackbarContext);
  snackbarState.dataName = "user";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = useCallback(
    async (formData) => {
      const { username, password } = formData;

      // Log the user in
      try {
        const response = await publicApi.post(
          "login",
          JSON.stringify(formData),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        // Update auth context with login response data
        const { accessToken, isAdmin } = response.data;
        setAuth({
          username,
          password,
          isAdmin,
          accessToken,
        });

        // Display welcome message on successful login
        dispatch({
          type: SNACKBAR_ACTIONS.LOGIN_SUCCESS,
          payload: { username },
        });

        // Redirect user to previously requested route
        navigate(from, { replace: true });
      } catch (err) {
        // Display error message on failed login
        dispatch({
          type: SNACKBAR_ACTIONS.LOGIN_ERROR,
          payload: {
            status: err?.response?.status,
            statusText: err?.response?.statusText,
            error: err,
            user: username,
          },
        });
      }
    },
    [dispatch, from, navigate, setAuth]
  );

  useEffect(() => {
    // Reset form fields on successful submit
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <Box sx={{ maxWidth: "24rem", mx: "auto", mt: 6 }}>
      <Stack
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="login-form"
        spacing={3}
        autoComplete="off"
      >
        <Typography variant="h2" mx="auto">
          Log In
        </Typography>
        {location.state?.sessionExpired && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ "& .MuiAlert-message": { pt: 1.3 } }}
          >
            Your session expired - <strong>log back in</strong>
          </Alert>
        )}
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
        <Button type="submit" variant="contained">
          Log In
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>
        <Typography color="text.disabled">Don't have an account?</Typography>
      </Divider>
      <Button
        onClick={() => navigate("/register")}
        variant="outlined"
        fullWidth
      >
        Create an account
      </Button>
      <CustomSnackbar {...snackbarState} />
    </Box>
  );
};

export default Login;
