import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (formData) => {
    console.log(formData);
  };

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
    </Box>
  );
};

export default Register;
