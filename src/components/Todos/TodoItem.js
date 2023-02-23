// mui components
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";

// mui icons
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";

function TodoItem(props) {
  return (
    <ListItem>
      <ListItemIcon>
        <CircleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={props.name} sx={{ flexGrow: 0 }} />
      <Tooltip title="Delete">
        <IconButton
          aria-label="delete"
          size="small"
          sx={{ ml: 2 }}
          onClick={props.onDeleteTodo}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}

export default TodoItem;
