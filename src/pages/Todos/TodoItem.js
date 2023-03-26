import { useState, useMemo, memo, useEffect, useRef } from "react";

// project import
import UpDownArrows from "../../components/UpDownArrows";

// mui components
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  TextField,
  Checkbox,
} from "@mui/material";

// mui icons
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

const TodoItem = memo((props) => {
  const {
    id,
    position,
    value,
    checked,
    onToggleTodo,
    onDeleteTodo,
    onEditTodo,
    onMove,
  } = props;
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => setContent(value), [value]);

  const handleMove = (direction) => onMove(direction, id);

  const todo = useMemo(() => {
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
                color: checked ? "rgba(255, 255, 255, 0.5)" : "inherit",
              }}
            />
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
            <TextField
              variant="standard"
              value={content}
              ref={inputRef}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleEdit}
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
  }, [editing, content, value, id, onEditTodo, checked]);

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
      <UpDownArrows
        position={position}
        moveUp={handleMove}
        disabled={checked}
      />
    </ListItem>
  );
});

export default TodoItem;
