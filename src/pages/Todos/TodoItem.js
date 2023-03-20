import { useState, useMemo, useEffect, useRef } from "react";

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
  const inputRef = useRef(null);

  useEffect(() => setContent(props.value), [props.value]);

  const todo = useMemo(() => {
    return (
      <>
        {!editing ? (
          <>
            <ListItemText primary={props.value} sx={{ maxWidth: "13.5rem" }} />
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
              ref={inputRef}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => setEditing(false)}
              autoFocus
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
