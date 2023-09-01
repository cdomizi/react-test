import { createContext, useReducer } from "react";
import { capitalize } from "@mui/material";

const SnackbarContext = createContext(null);

// Snackbar initial state
const initialState = {
  open: false,
  vertical: "top",
  horizontal: "center",
  success: true,
  message: null,
  dataName: null,
};

// Snackbar reducer actions
const SNACKBAR_ACTIONS = {
  CREATE: "create",
  CREATE_ERROR: "create error",
  EDIT: "edit",
  EDIT_ERROR: "edit error",
  DELETE: "delete",
  DELETE_ERROR: "delete error",
  UNIQUE_FIELD_ERROR: "unique field error",
  LOGIN_SUCCESS: "login success",
  LOGIN_ERROR: "login error",
  LOGOUT_SUCCESS: "logout success",
  LOGOUT_ERROR: "logout error",
  CLOSE: "close",
};

// Get login error message based on error status code
const loginErrorMessage = (payload) => {
  switch (payload?.status) {
    case 400: {
      return "Login failed: Missing credentials";
    }
    case 401: {
      return `Login failed: Wrong password for user ${payload?.user}`;
    }
    case 404: {
      return `Login failed: User ${payload?.user} does not exist`;
    }
    default: {
      return payload?.status >= 500
        ? "Login failed: Service termporarily unavailable"
        : "User login failed";
    }
  }
};

// Snackbar reducer function
const snackbarReducer = (state, action) => {
  switch (action.type) {
    case SNACKBAR_ACTIONS.CREATE: {
      return {
        ...initialState,
        open: true,
        success: true,
        message: `${
          action.payload.length
            ? capitalize(action.payload)
            : capitalize(action?.dataName) || (state?.dataName ?? "item")
        } created successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.CREATE_ERROR: {
      console.error(
        `Error while creating the ${
          action?.dataName || (state?.dataName ?? "item")
        }: ${action.payload.status} - ${action.payload.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to create the ${
          action?.dataName || (state?.dataName ?? "item")
        }.`,
      };
    }
    case SNACKBAR_ACTIONS.EDIT: {
      return {
        ...initialState,
        open: true,
        success: true,
        message: `${
          action.payload.length
            ? action.payload
            : state?.dataName
            ? capitalize(state?.dataName)
            : "Item"
        } edited successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.EDIT_ERROR: {
      console.error(
        `Error while editing the ${
          action?.dataName || (state?.dataName ?? "item")
        }: ${action.payload.status} - ${action.payload.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to edit the ${
          action?.dataName || (state?.dataName ?? "item")
        }.`,
      };
    }
    case SNACKBAR_ACTIONS.DELETE: {
      return {
        ...initialState,
        open: true,
        success: true,
        message: `${
          action.payload.length
            ? action.payload
            : capitalize(action?.dataName) ||
              (capitalize(state?.dataName) ?? "Item")
        } deleted successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.DELETE_ERROR: {
      console.error(
        `Error while deleting the ${
          action?.dataName || (state?.dataName ?? "item")
        }: ${action.payload.status} - ${action.payload.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to delete the ${
          action?.dataName || (state?.dataName ?? "item")
        }.`,
      };
    }
    case SNACKBAR_ACTIONS.UNIQUE_FIELD_ERROR: {
      console.error(
        `404 Bad Request - Duplicate ${action.payload.field}: "${action.payload.value}"`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `${
          capitalize(action?.dataName) ||
          (capitalize(state?.dataName) ?? "item")
        } with ${action.payload.field} "${
          action.payload.value
        }" already exists.`,
      };
    }
    case SNACKBAR_ACTIONS.LOGIN_SUCCESS: {
      return {
        ...initialState,
        open: true,
        success: true,
        message: `Welcome ${action.payload.username}!`,
      };
    }
    case SNACKBAR_ACTIONS.LOGIN_ERROR: {
      console.error(
        `Error: User login failed: ${action.payload?.status} ${action.payload?.statusText}`,
        action.payload?.error
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: loginErrorMessage(action.payload),
      };
    }
    case SNACKBAR_ACTIONS.LOGOUT_SUCCESS: {
      return {
        ...initialState,
        open: true,
        success: true,
        message:
          action?.payload?.status === 204
            ? "You are already logged out"
            : "You successfully logged out",
      };
    }
    case SNACKBAR_ACTIONS.LOGOUT_ERROR: {
      return {
        ...initialState,
        open: true,
        success: false,
        message: "Error: User logout failed",
      };
    }
    case SNACKBAR_ACTIONS.CLOSE: {
      // Do not close the snackbar if the user just clicked away
      if (action.payload === "clickaway") {
        return state;
      }
      return initialState;
    }
    default: {
      return state;
    }
  }
};

const SnackbarProvider = ({ children }) => {
  // Snackbar reducer
  const [snackbarState, dispatch] = useReducer(snackbarReducer, initialState);

  return (
    <SnackbarContext.Provider value={{ snackbarState, dispatch }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext;
export { SnackbarProvider, SNACKBAR_ACTIONS };
