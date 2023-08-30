import { useContext } from "react";
import DialogContext, { DIALOG_ACTIONS } from "../contexts/DialogContext";

// MUI components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const CustomDialog = ({
  open,
  title,
  contentText,
  contentForm,
  confirm,
  cancel,
}) => {
  // State and dispatch function for dialog component
  const dispatch = useContext(DialogContext);

  return (
    <Dialog
      open={open}
      onClose={() => dispatch({ type: DIALOG_ACTIONS.CLOSE })}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        confirm?.onConfirm(event) || dispatch({ type: DIALOG_ACTIONS.CLOSE });
      }}
      autoComplete="off"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
        {contentForm}
      </DialogContent>
      <DialogActions>
        {confirm && (
          <Button type="submit">{confirm?.buttonText || "Confirm"}</Button>
        )}
        {cancel && (
          <Button
            onClick={() => dispatch({ type: DIALOG_ACTIONS.CLOSE })}
            color="error"
            type="button"
          >
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
