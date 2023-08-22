import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";

// Fake data for testing - REMOVE
const userData = {
  username: "testUsername",
  password: "testPassword",
  isAdmin: true,
  // "isAdmin": false,
};

const Profile = () => {
  const { id } = useParams();

  const [edit, setEdit] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      password: userData?.password || "",
      confirmPassword: "",
    },
  });

  const onSubmit = (formData) => {
    console.log(formData);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setEdit(false);
    }
  }, [isSubmitSuccessful, reset]);

  const adminSection = useMemo(
    () => (
      <Stack spacing={2}>
        <Typography variant="h5" mx="auto">
          Admin Panel
        </Typography>
        <Button variant="contained">Manage users</Button>
      </Stack>
    ),
    []
  );

  const accountSettings = useMemo(
    () => (
      <>
        <Stack
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          spacing={2}
          id="profile-account-settings"
        >
          <Typography variant="h5" mx="auto">
            Account Settings
          </Typography>
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
                disabled={!edit}
                fullWidth
                margin="normal"
              />
            )}
          />
          {edit ? (
            <>
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
                      errors?.confirmPassword &&
                      errors?.confirmPassword?.message
                    }
                    InputLabelProps={{ required: true }}
                    disabled={!edit}
                    fullWidth
                    margin="normal"
                  />
                )}
              />
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" fullWidth>
                  Save
                </Button>
                <Button
                  onClick={() => setEdit(false)}
                  type="button"
                  variant="outlined"
                  color="secondary"
                >
                  Undo
                </Button>
              </Stack>
            </>
          ) : (
            <Button onClick={() => setEdit(true)} variant="outlined">
              Change my password
            </Button>
          )}
        </Stack>
        <Button variant="outlined" color="error">
          Delete my account
        </Button>
      </>
    ),
    [control, edit, errors, handleSubmit, watch]
  );

  return (
    <Stack>
      <Box id="profile-title" mb={6}>
        <Typography variant="h3">
          Hi, {userData.username}!
          {userData?.isAdmin && (
            <Typography color="text.disabled">Admin account</Typography>
          )}
        </Typography>
      </Box>
      <Stack spacing={5} maxWidth="22rem" id="profile-admin-section">
        {accountSettings}
        {userData?.isAdmin && adminSection}
      </Stack>
    </Stack>
  );
};

export default Profile;
