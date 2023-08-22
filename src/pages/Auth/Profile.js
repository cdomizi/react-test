import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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

  const [openDialog, setOpenDialog] = useState(false);
  const passwordRef = useRef(null);
  const [requiredError, setRequiredError] = useState(false);

  // Password edit form
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

  const onPasswordEditSubmit = useCallback((formData) => {
    console.log(formData);
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setEdit(false);
    }
  }, [isSubmitSuccessful, reset]);

  const onDialogSubmit = useCallback((event) => {
    event.preventDefault();

    const password = passwordRef.current.value;

    if (!password?.length) {
      setRequiredError(true);
    } else {
      if (password === userData?.password) {
        console.log(password);
        passwordRef.current = null;
        setOpenDialog(false);
      }
      console.error("Wrong password");
    }
  }, []);

  const accountSettings = useMemo(
    () => (
      <Box maxWidth="22rem">
        <Typography variant="h5">Account Settings</Typography>
        <Stack
          onSubmit={handleSubmit(onPasswordEditSubmit)}
          component="form"
          id="profile-account-settings"
          spacing={2}
          my={5}
        >
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
                id="edit-password"
                label="Password"
                type="password"
                error={!!errors?.password}
                helperText={errors?.password && errors?.password?.message}
                InputLabelProps={{ required: true, shrink: true }}
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
                    InputLabelProps={{ required: true, shrink: true }}
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
                  onClick={() => {
                    setEdit(false);
                    reset();
                  }}
                  type="button"
                  variant="outlined"
                  color="secondary"
                >
                  Cancel
                </Button>
              </Stack>
            </>
          ) : (
            <Button onClick={() => setEdit(true)} variant="outlined">
              Change my password
            </Button>
          )}
        </Stack>
        <Button
          onClick={() => setOpenDialog(true)}
          variant="outlined"
          color="error"
        >
          Delete my account
        </Button>
      </Box>
    ),
    [control, edit, errors, handleSubmit, onPasswordEditSubmit, reset, watch]
  );

  const AdminSection = () => (
    <>
      <Divider sx={{ my: 7 }} />
      <Typography variant="h5" mb={5}>
        Admin Panel
      </Typography>
      <Button variant="contained" sx={{ maxWidth: "fit-content" }}>
        Manage users
      </Button>
    </>
  );

  const deleteDialog = useMemo(
    () => (
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        component="form"
        onSubmit={(event) => onDialogSubmit(event)}
      >
        <DialogTitle>Account delete confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account?
            <br />
            Enter your password to confirm:
          </DialogContentText>
          <TextField
            id="edit-password"
            name="password"
            label="Password"
            type="password"
            inputRef={passwordRef}
            onChange={(event) =>
              passwordRef.current?.value?.length && setRequiredError(false)
            }
            error={!!requiredError}
            helperText={!!requiredError && "Please enter your password"}
            InputLabelProps={{ required: true, shrink: true }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => onDialogSubmit(event)}
            type="submit"
            color="error"
          >
            Delete my account
          </Button>
          <Button
            onClick={() => {
              passwordRef.current = "";
              setOpenDialog(false);
            }}
            type="button"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    ),
    [onDialogSubmit, openDialog, requiredError]
  );

  return (
    <Box>
      <Box id="profile-title" mb={8}>
        <Typography variant="h3">
          Hi, {userData.username}!
          {userData?.isAdmin && (
            <Typography color="text.disabled">Admin account</Typography>
          )}
        </Typography>
      </Box>
      {accountSettings}
      {userData?.isAdmin && <AdminSection />}
      {deleteDialog}
    </Box>
  );
};

export default Profile;
