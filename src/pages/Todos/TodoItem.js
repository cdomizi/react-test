import { useState, useMemo, useEffect, useRef } from "react";

// mui components
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Input,
  Checkbox,
} from "@mui/material";

// mui icons
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

function TodoItem(props) {
  const { id, value, checked, onToggleTodo, onDeleteTodo, onEditTodo } = props;
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => setContent(value), [value]);

  const todo = useMemo(() => {
    return (
      <>
        {!editing ? (
          <>
            <ListItemText primary={value} sx={{ maxWidth: "13.5rem" }} />
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
              onBlur={() => {
                onEditTodo([id, content]);
                setContent(value);
                setEditing(false);
              }}
              autoFocus
            />
            <Tooltip title="Done">
              <IconButton aria-label="done" size="small" sx={{ ml: 2 }}>
                <DoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    );
  }, [editing, content, id, value, onEditTodo]);

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox fontSize="small" checked={checked} onChange={onToggleTodo} />
      </ListItemIcon>
      {todo}
      <Tooltip title="Delete">
        <IconButton aria-label="delete" size="small" onClick={onDeleteTodo}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}

export default TodoItem;
