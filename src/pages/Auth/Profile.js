import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DialogContext, { DIALOG_ACTIONS } from "../../contexts/DialogContext";

import {
  Box,
  Button,
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

  // ====== Password edit section ====== //
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordEditSubmit = useCallback((formData) => {
    formData.currentPassword === userData?.password
      ? console.log(formData)
      : console.error("The password you entered is wrong");
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setEdit(false);
    }
  }, [isSubmitSuccessful, reset]);
  // ====== End Password edit section ====== //

  // ====== Dialog section ====== //
  const passwordRef = useRef(null);
  const [deleteDialogError, setDeleteDialogError] = useState(false);

  // State and dispatch function for dialog component
  const dispatch = useContext(DialogContext);

  // If the password is wrong, alert the user
  useEffect(() => {
    if (deleteDialogError)
      dispatch({
        type: DIALOG_ACTIONS.OPEN,
        payload: {
          open: false,
          title: "Error: Wrong password",
          contentText: "The password you entered is wrong",
          contentForm: null,
          confirm: {
            buttonText: "Ok",
            onConfirm: () => {
              dispatch({
                type: DIALOG_ACTIONS.CLOSE,
              });
              setDeleteDialogError(false);
            },
          },
          cancel: null,
        },
      });
  }, [deleteDialogError, dispatch]);

  const onDialogSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const submittedPassword = passwordRef.current.value;

      // On correct password, delete the account
      if (submittedPassword === userData?.password) {
        console.log(submittedPassword);
        // On wrong password, set the error state to `true`
      } else {
        dispatch({ type: DIALOG_ACTIONS.CLOSE });
        setDeleteDialogError(true);
      }

      // Always clear input value
      passwordRef.current.value = null;
      return;
    },
    [dispatch]
  );

  // Field to enter password for delete confirmation
  const passwordField = useMemo(
    () => (
      <TextField
        id="edit-password"
        inputRef={passwordRef}
        name="password"
        label="Password"
        type="password"
        InputLabelProps={{ shrink: true }}
        required
        fullWidth
        margin="normal"
      />
    ),
    []
  );

  // Initial state for password delete confirmation dialog
  const initialDeleteDialogState = useMemo(
    () => ({
      open: false,
      title: "Account delete confirmation",
      contentText:
        "Are you sure you want to delete your account?\nEnter your password to confirm:",
      contentForm: passwordField,
      confirm: { buttonText: "Delete my account", onConfirm: onDialogSubmit },
      cancel: true,
    }),
    [passwordField, onDialogSubmit]
  );
  // ====== End dialog section ====== //

  // ====== Account settings section ====== //
  const accountSettings = useMemo(
    () => (
      <Box maxWidth="22rem">
        <Typography variant="h5">Account Settings</Typography>
        {edit ? (
          <Stack
            onSubmit={handleSubmit(onPasswordEditSubmit)}
            component="form"
            id="profile-account-settings"
            spacing={2}
            my={5}
          >
            <Controller
              control={control}
              name="currentPassword"
              rules={{
                required: "Please enter your current password",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (val) =>
                  val === userData?.password ||
                  "The password you entered is wrong",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="currentPassword"
                  label="Current Password"
                  type="password"
                  error={!!errors?.currentPassword}
                  helperText={
                    errors?.currentPassword && errors?.currentPassword?.message
                  }
                  InputLabelProps={{ required: true, shrink: true }}
                  disabled={!edit}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: "Please enter your new password",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="newPassword"
                  label="New Password"
                  type="password"
                  error={!!errors?.newPassword}
                  helperText={
                    errors?.newPassword && errors?.newPassword?.message
                  }
                  InputLabelProps={{ required: true, shrink: true }}
                  disabled={!edit}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your new password",
                validate: (val) =>
                  val === watch("newPassword") || "Passwords do not match",
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
          </Stack>
        ) : (
          <Button
            onClick={() => setEdit(true)}
            variant="outlined"
            fullWidth={false}
            sx={{ mt: 5, mb: 3 }}
          >
            Change my password
          </Button>
        )}
        <Button
          onClick={() =>
            dispatch({
              type: DIALOG_ACTIONS.OPEN,
              payload: initialDeleteDialogState,
            })
          }
          variant="outlined"
          color="error"
        >
          Delete my account
        </Button>
      </Box>
    ),
    [
      control,
      dispatch,
      edit,
      errors,
      handleSubmit,
      initialDeleteDialogState,
      onPasswordEditSubmit,
      reset,
      watch,
    ]
  );
  // ====== End Account settings section ====== //

  // ====== Admin section ====== //
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
  // ====== End Admin section ====== //

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
    </Box>
  );
};

export default Profile;
