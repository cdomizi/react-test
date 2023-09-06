import { createContext, useReducer } from "react";
import { capitalize } from "@mui/material";
import CustomSnackbar from "../components/CustomSnackbar";

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
  REGISTER_SUCCESS: "register success",
  REGISTER_ERROR: "register error",
  LOGIN_SUCCESS: "login success",
  LOGIN_ERROR: "login error",
  LOGOUT_SUCCESS: "logout success",
  LOGOUT_ERROR: "logout error",
  GENERIC_SUCCESS: "generic success",
  GENERIC_ERROR: "generic error",
  CLOSE: "close",
};

// Get login/registration error message based on error status code
const formatErrorMessage = (payload, isLogin) => {
  // Set message action
  const action = isLogin ? "Login" : "Registration";

  switch (payload?.status) {
    case 400: {
      return `${action} failed: Missing credentials`;
    }
    case 401: {
      return `${action} failed: Wrong password for user ${payload?.user}`;
    }
    case 404: {
      return `${action} failed: User ${payload?.user} does not exist`;
    }
    default: {
      return payload?.status >= 500
        ? `${action} failed: Service termporarily unavailable`
        : `User ${action.toLowerCase()} failed`;
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
            : capitalize(action?.dataName) || "item"
        } created successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.CREATE_ERROR: {
      console.error(
        `Error while creating the ${action?.dataName || "item"}: ${
          action.payload?.status
        } - ${action.payload?.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to create the ${action?.dataName || "item"}.`,
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
            ? capitalize(action?.dataName)
            : "Item"
        } edited successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.EDIT_ERROR: {
      console.error(
        `Error while editing the ${action?.dataName || "item"}: ${
          action.payload?.status
        } - ${action.payload?.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to edit the ${action?.dataName || "item"}.`,
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
            : capitalize(action?.dataName) || "Item"
        } deleted successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.DELETE_ERROR: {
      console.error(
        `Error while deleting the ${action?.dataName || "item"}: ${
          action.payload?.status
        } - ${action.payload?.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to delete the ${action?.dataName || "item"}.`,
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
        message: `${capitalize(action?.dataName) || "item"} with ${
          action.payload?.field
        } "${action.payload?.value}" already exists.`,
      };
    }
    case SNACKBAR_ACTIONS.REGISTER_SUCCESS: {
      return {
        ...initialState,
        open: true,
        success: true,
        message: `${action.payload.username} registered successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.REGISTER_ERROR: {
      console.error(
        `Error - User registration failed: ${action.payload?.status} ${action.payload?.statusText}`,
        action.payload?.error
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: formatErrorMessage(action.payload, false),
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
        `Error - User login failed: ${action.payload?.status} ${action.payload?.statusText}`,
        action.payload?.error
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: formatErrorMessage(action.payload, true),
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
    case SNACKBAR_ACTIONS.GENERIC_SUCCESS: {
      return {
        ...initialState,
        open: true,
        success: true,
        message:
          action.payload?.message || "The action was performed successfully!",
      };
    }
    case SNACKBAR_ACTIONS.GENERIC_ERROR: {
      return {
        ...initialState,
        open: true,
        success: false,
        message:
          action.payload?.message || "Error: Couldn't fulfill your request",
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
    <SnackbarContext.Provider value={dispatch}>
      {children}
      <CustomSnackbar {...snackbarState} />
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext;
export { SnackbarProvider, SNACKBAR_ACTIONS };
