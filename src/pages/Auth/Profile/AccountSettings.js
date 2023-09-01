import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";

// Project import
import AuthContext from "../../../contexts/AuthContext";
import DialogContext, { DIALOG_ACTIONS } from "../../../contexts/DialogContext";

// MUI components
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const AccountSettings = () => {
  const { auth } = useContext(AuthContext);

  const [edit, setEdit] = useState(false);

  // ======== Password change section ======== //
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

  const onPasswordEditSubmit = useCallback(
    (formData) => {
      formData.currentPassword === auth?.password
        ? console.log(formData)
        : console.error("The password you entered is wrong");
    },
    [auth?.password]
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setEdit(false);
    }
  }, [isSubmitSuccessful, reset]);
  // ====== End Password change section ====== //

  // ============ Dialog section ============= //
  const passwordRef = useRef(null);
  const [dialogError, setdialogError] = useState(false);

  // State and dispatch function for dialog component
  const dispatch = useContext(DialogContext);

  // If the password is wrong, alert the user
  useEffect(() => {
    if (dialogError)
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
              setdialogError(false);
            },
          },
          cancel: null,
        },
      });
  }, [dialogError, dispatch]);

  const onDialogSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const submittedPassword = passwordRef.current.value;

      // On correct password, delete the account
      if (submittedPassword === auth?.password) {
        console.log(submittedPassword);
        // On wrong password, set the error state to `true`
      } else {
        dispatch({ type: DIALOG_ACTIONS.CLOSE });
        setdialogError(true);
      }

      // Always clear input value
      passwordRef.current.value = null;
      return;
    },
    [auth?.password, dispatch]
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

  // Initial state for role change confirmation dialog
  const initialRoleDialogState = useMemo(
    () => ({
      open: false,
      title: "Role change confirmation",
      contentText:
        "Are you sure you want to change the role to User for your account?\nEnter your password to confirm:",
      contentForm: passwordField,
      confirm: { buttonText: "Change role to User", onConfirm: onDialogSubmit },
      cancel: true,
    }),
    [passwordField, onDialogSubmit]
  );
  // ========== End dialog section =========== //

  return (
    <Box maxWidth="22rem">
      <Typography variant="h5" mb={5}>
        Account Settings
      </Typography>
      {edit ? (
        <Stack
          onSubmit={handleSubmit(onPasswordEditSubmit)}
          component="form"
          id="profile-account-settings"
          spacing={2}
          mb={5}
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
                val === auth?.password || "The password you entered is wrong",
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
                helperText={errors?.newPassword && errors?.newPassword?.message}
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
          sx={{ mb: 3 }}
        >
          Change my password
        </Button>
      )}
      {auth?.isAdmin && (
        <Button
          onClick={() =>
            dispatch({
              type: DIALOG_ACTIONS.OPEN,
              payload: initialRoleDialogState,
            })
          }
          variant="outlined"
          sx={{ display: "block", mb: 3 }}
        >
          Change my role
        </Button>
      )}
      <Button
        onClick={() =>
          dispatch({
            type: DIALOG_ACTIONS.OPEN,
            payload: initialDeleteDialogState,
          })
        }
        sx={{ display: "block" }}
        variant="outlined"
        color="error"
      >
        Delete my account
      </Button>
    </Box>
  );
};

export default AccountSettings;
