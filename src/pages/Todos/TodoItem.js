import { useState, useMemo, memo, useEffect, useRef } from "react";

// Project import
import UpDownArrows from "./UpDownArrows";

// MUI components
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
} from "@mui/material";

// MUI icons
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

const TodoItem = memo(
  ({
    id,
    position,
    value,
    checked,
    onToggleTodo,
    onDeleteTodo,
    onEditTodo,
    onMove,
  }) => {
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(value);
    const inputRef = useRef(null);

    // update content as the user types
    useEffect(() => setContent(value), [value]);

    // handle moving todo up/down
    const handleMove = (direction) => onMove(direction, id);

    const todo = useMemo(() => {
      // edit todo only if not empty, else keep previous content
      const handleEdit = content.length
        ? () => {
            onEditTodo([id, content]);
            setContent(value);
            setEditing(false);
          }
        : () => {
            setEditing(false);
          };

      return (
        <>
          {!editing ? (
            <>
              <ListItemText
                primary={value}
                sx={{
                  maxWidth: "13.5rem",
                  textDecoration: checked ? "line-through" : "inherit",
                  color: checked ? "text.disabled" : "inherit",
                }}
              />
              <Tooltip title="Edit">
                <IconButton
                  aria-label="edit"
                  sx={{ ml: 2 }}
                  onClick={() => setEditing(true)}
                >
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <TextField
                variant="standard"
                value={content}
                ref={inputRef}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleEdit}
                autoFocus
              />
              <Tooltip title="Done">
                <IconButton aria-label="done" color="success" sx={{ ml: 2 }}>
                  <DoneIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </>
      );
    }, [content, editing, value, checked, onEditTodo, id]);

    return (
      <ListItem>
        <ListItemIcon>
          <Checkbox checked={checked} onChange={onToggleTodo} />
        </ListItemIcon>
        {todo}
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={onDeleteTodo}>
            <DeleteIcon color="error" />
          </IconButton>
        </Tooltip>
        <UpDownArrows
          position={position}
          moveUp={handleMove}
          disabled={checked}
        />
      </ListItem>
    );
  }
);

export default TodoItem;
