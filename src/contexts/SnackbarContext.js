import { createContext, useReducer } from "react";
import CustomSnackbar from "../components/CustomSnackbar";
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
  CLOSE: "close",
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
            ? action.payload
            : state?.dataName
            ? capitalize(state?.dataName?.singular)
            : "Item"
        } created successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.CREATE_ERROR: {
      console.error(
        `Error while creating the ${state?.dataName?.singular ?? "item"}: ${
          action.payload.status
        } - ${action.payload.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to create the ${
          state?.dataName?.singular ?? "item"
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
            ? capitalize(state?.dataName?.singular)
            : "Item"
        } edited successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.EDIT_ERROR: {
      console.error(
        `Error while editing the ${state?.dataName?.singular ?? "item"}: ${
          action.payload.status
        } - ${action.payload.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to edit the ${
          state?.dataName?.singular ?? "item"
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
            : state?.dataName
            ? capitalize(state?.dataName?.singular)
            : "Item"
        } deleted successfully!`,
      };
    }
    case SNACKBAR_ACTIONS.DELETE_ERROR: {
      console.error(
        `Error while deleting the ${state?.dataName?.singular ?? "item"}: ${
          action.payload.status
        } - ${action.payload.statusText}`
      );
      return {
        ...initialState,
        open: true,
        success: false,
        message: `Sorry! Unable to delete the ${
          state?.dataName?.singular ?? "item"
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
        message: `${capitalize(state?.dataName?.singular) ?? "Item"} with ${
          action.payload.field
        } "${action.payload.value}" already exists.`,
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
    <SnackbarContext.Provider value={[snackbarState, dispatch]}>
      {children}
      <CustomSnackbar {...snackbarState} />
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext;
export { SnackbarProvider, SNACKBAR_ACTIONS };
