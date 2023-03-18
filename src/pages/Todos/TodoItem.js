import { useState, useMemo, useEffect } from "react";

// mui components
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Input,
} from "@mui/material";

// mui icons
import {
  Circle as CircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

function TodoItem(props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(props.value);

  useEffect(() => setContent(props.value), [props.value]);

  const todo = useMemo(() => {
    return (
      <>
        {!editing ? (
          <>
            <ListItemText primary={props.value} sx={{ flexGrow: 0 }} />
            <Tooltip title="Edit">
              <IconButton
                aria-label="edit"
                size="small"
                sx={{ ml: 2 }}
                onClick={() => setEditing(true)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Tooltip title="Done">
              <IconButton
                aria-label="done"
                size="small"
                sx={{ ml: 2 }}
                onClick={() => {
                  props.onEditTodo([props.id, content]);
                  setContent(props.value);
                  setEditing(false);
                }}
              >
                <DoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    );
  }, [editing, content, props]);

  return (
    <ListItem>
      <ListItemIcon>
        <CircleIcon fontSize="small" />
      </ListItemIcon>
      {todo}
      <Tooltip title="Delete">
        <IconButton
          aria-label="delete"
          size="small"
          onClick={props.onDeleteTodo}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}

export default TodoItem;
