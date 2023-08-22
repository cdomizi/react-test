import { useForm, Controller } from "react-hook-form";

// MUI components
const {
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} = require("@mui/material");

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (formData) => {
    console.log(formData);
  };

  return (
    <Box sx={{ maxWidth: "24rem", mx: "auto", mt: 6 }}>
      <Stack
        onSubmit={handleSubmit(onSubmit)}
        spacing={3}
        component="form"
        id="login-form"
      >
        <Typography variant="h2" mx="auto">
          Log In
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
        <Button type="submit" variant="contained">
          Log In
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>
        <Typography color="text.disabled">Don't have an account?</Typography>
      </Divider>
      <Button href="register" variant="outlined" fullWidth>
        Create an account
      </Button>
    </Box>
  );
};

export default Login;
