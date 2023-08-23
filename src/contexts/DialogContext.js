import { createContext, useReducer } from "react";

const DialogContext = createContext(null);

// Dialog initial state
const initialState = {
  open: false,
  title: null,
  contentText: null,
  contentFields: null,
  actions: {
    confirm: null,
    cancel: null,
    submit: null,
  },
};

// Dialog reducer actions
const DIALOG_ACTIONS = {
  OPEN: "open",
  CLOSE: "close",
  CONFIRM: "confirm",
  SUBMIT: "submit",
  ERROR: "error",
};

// Dialog reducer function
const dialogReducer = (state, action) => {
  switch (action.type) {
    case DIALOG_ACTIONS.OPEN: {
      return {
        ...initialState,
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
    case DIALOG_ACTIONS.SUBMIT: {
      return {
        ...initialState,
        actions: {
          ...initialState.actions,
          submit: action.payload,
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
    <DialogContext.Provider value={[dialogState, dispatch]}>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogContext;
export { DialogProvider, DIALOG_ACTIONS };
