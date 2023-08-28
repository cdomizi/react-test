import { createContext, useReducer } from "react";
import CustomDialog from "../components/CustomDialog";

const DialogContext = createContext(null);

// Dialog initial state
const initialState = {
  open: false,
  title: null,
  contentText: null,
  contentFields: null,
  confirm: null,
  cancel: null,
};

// Dialog reducer actions
const DIALOG_ACTIONS = {
  OPEN: "open",
  CLOSE: "close",
  CONFIRM: "confirm",
  ERROR: "error",
};

// Dialog reducer function
const dialogReducer = (state, action) => {
  switch (action.type) {
    case DIALOG_ACTIONS.OPEN: {
      return {
        ...initialState,
        ...action.payload,
        open: true,
      };
    }
    case DIALOG_ACTIONS.CLOSE: {
      return initialState;
    }
    case DIALOG_ACTIONS.CONFIRM: {
      return {
        ...initialState,
        actions: {
          ...initialState.actions,
          confirm: action.payload,
        },
      };
    }
    case DIALOG_ACTIONS.ERROR: {
      return {
        ...initialState,
        actions: {
          ...initialState.actions,
          error: action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
};

const DialogProvider = ({ children }) => {
  // Dialog reducer
  const [dialogState, dispatch] = useReducer(dialogReducer, initialState);

  return (
    <DialogContext.Provider value={dispatch}>
      {children}
      <CustomDialog {...dialogState} />
    </DialogContext.Provider>
  );
};

export default DialogContext;
export { DialogProvider, DIALOG_ACTIONS };
