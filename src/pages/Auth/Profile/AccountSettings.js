import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

// Project import
import useAuthApi from "../../../hooks/useAuthApi";
import AuthContext from "../../../contexts/AuthContext";
import DialogContext, { DIALOG_ACTIONS } from "../../../contexts/DialogContext";
import SnackbarContext, {
  SNACKBAR_ACTIONS,
} from "../../../contexts/SnackbarContext";
import CustomSnackbar from "../../../components/CustomSnackbar";

// MUI components
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const AccountSettings = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const authApi = useAuthApi();

  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);

  // State and dispatch function for dialog component
  const dialogDispatch = useContext(DialogContext);

  // Set up snackbar
  const { snackbarState, dispatch: snackbarDispatch } =
    useContext(SnackbarContext);
  snackbarState.dataName = "user";

  // ======== Password change section ======== //
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordEditSubmit = useCallback(
    async (formData) => {
      try {
        const { password, newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
          console.error("Error: Passwords do not match");
          // On error, notify the user
          snackbarDispatch({
            type: SNACKBAR_ACTIONS.EDIT_ERROR,
            payload: { status: 400, statusText: "Passwords do not match" },
          });
          return;
        }

        // Check correct password
        const response = await authApi.post(`users/${auth?.id}/password`, {
          id: auth?.id,
          password: password,
          isAdmin: auth?.isAdmin,
        });

        if (response.status === 200) {
          // On correct password, set the new password
          try {
            // eslint-disable-next-line no-unused-vars
            const response = await authApi.put(`users/${auth?.id}`, {
              password: newPassword,
              isAdmin: auth?.isAdmin,
            });

            // On successful edit, notify the user
            snackbarDispatch({
              type: SNACKBAR_ACTIONS.GENERIC_SUCCESS,
              payload: { message: "Password changed successfully" },
            });
            return;
          } catch (err) {
            console.error(err);
            // On error, notify the user
            snackbarDispatch({
              type: SNACKBAR_ACTIONS.GENERIC_ERROR,
              payload: { message: "Error: Could not change your password" },
            });
            return;
          }
        } else {
          // On wrong password, set the error state to `true`
          dialogDispatch({ type: DIALOG_ACTIONS.CLOSE });
          setdialogError(true);
          return;
        }
      } catch (err) {
        console.error(err);
        // On error close the dialog and alert the user
        dialogDispatch({ type: DIALOG_ACTIONS.CLOSE });
        snackbarDispatch({
          type: DIALOG_ACTIONS.GENERIC_ERROR,
          payload: { message: "Error: Could not delete your account" },
        });
        return;
      }
    },
    [auth?.id, auth?.isAdmin, authApi, dialogDispatch, snackbarDispatch]
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

  // If the password is wrong, alert the user
  useEffect(() => {
    if (dialogError)
      dialogDispatch({
        type: DIALOG_ACTIONS.OPEN,
        payload: {
          open: false,
          title: "Error: Wrong password",
          contentText: "The password you entered is wrong",
          contentForm: null,
          confirm: {
            buttonText: "Ok",
            onConfirm: () => {
              dialogDispatch({
                type: DIALOG_ACTIONS.CLOSE,
              });
              setdialogError(false);
            },
          },
          cancel: null,
        },
      });
  }, [dialogError, dialogDispatch]);

  const onDeleteDialogSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const submittedPassword = passwordRef.current.value;

      try {
        // Check password confirmation
        const response = await authApi.post(`users/${auth?.id}/password`, {
          id: auth?.id,
          password: submittedPassword,
          isAdmin: auth?.isAdmin,
        });
        if (response.status === 200) {
          // On correct password, delete the account
          const response = await authApi.delete(`users/${auth?.id}`, {
            id: auth?.id,
          });

          // On success notify the user, clear auth context and redirect to home
          snackbarDispatch({
            type: SNACKBAR_ACTIONS.DELETE,
            payload: response.data?.username,
          });
          setAuth({});
          navigate("/");
          return;
        } else {
          // On wrong password, set the error state to `true`
          dialogDispatch({ type: DIALOG_ACTIONS.CLOSE });
          setdialogError(true);
        }
      } catch (err) {
        console.error(err);
        // On error close the dialog and notify the user
        dialogDispatch({ type: DIALOG_ACTIONS.CLOSE });
        snackbarDispatch({
          type: SNACKBAR_ACTIONS.GENERIC_ERROR,
          payload: { message: "Error: Could not delete your account" },
        });
      }

      // Always clear input value
      passwordRef.current.value = null;
      return;
    },
    [
      auth?.id,
      auth?.isAdmin,
      authApi,
      dialogDispatch,
      navigate,
      setAuth,
      snackbarDispatch,
    ]
  );

  const onRoleDialogSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const submittedPassword = passwordRef.current.value;

      try {
        // Check password confirmation
        const response = await authApi.post(`users/${auth?.id}/password`, {
          id: auth?.id,
          password: submittedPassword,
          isAdmin: auth?.isAdmin,
        });
        if (response.status === 200) {
          // On correct password, change user role to "User"
          const response = await authApi.put(`users/${auth?.id}`, {
            isAdmin: false,
          });

          // Close the dialog & update auth context
          dialogDispatch({ type: DIALOG_ACTIONS.CLOSE });
          setAuth({ ...auth, isAdmin: false });

          // On success notify the user
          snackbarDispatch({
            type: SNACKBAR_ACTIONS.EDIT,
            payload: response.data?.username,
          });
          return;
        } else {
          // On wrong password, set the error state to `true`
          dialogDispatch({ type: DIALOG_ACTIONS.CLOSE });
          setdialogError(true);
        }
      } catch (err) {
        console.error(err);
        // On error close the dialog and notify the user
        dialogDispatch({ type: DIALOG_ACTIONS.CLOSE });
        snackbarDispatch({
          type: SNACKBAR_ACTIONS.EDIT_ERROR,
          payload: auth?.username,
        });
      }

      // Always clear input value
      passwordRef.current.value = null;
      return;
    },
    [auth, authApi, dialogDispatch, setAuth, snackbarDispatch]
  );

  // Field to enter password for role change confirmation
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
      confirm: {
        buttonText: "Delete my account",
        onConfirm: onDeleteDialogSubmit,
      },
      cancel: true,
    }),
    [passwordField, onDeleteDialogSubmit]
  );

  // Initial state for role change confirmation dialog
  const initialRoleDialogState = useMemo(
    () => ({
      open: false,
      title: "Role change confirmation",
      contentText:
        "Are you sure you want to change the role to User for your account?\nEnter your password to confirm:",
      contentForm: passwordField,
      confirm: {
        buttonText: "Change role to User",
        onConfirm: onRoleDialogSubmit,
      },
      cancel: true,
    }),
    [passwordField, onRoleDialogSubmit]
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
            name="password"
            rules={{
              required: "Please enter your current password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="password"
                label="Current Password"
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
            dialogDispatch({
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
          dialogDispatch({
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
      <CustomSnackbar {...snackbarState} />
    </Box>
  );
};

export default AccountSettings;
