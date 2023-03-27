import { useState, memo } from "react";

//mui import
import { Button, TextField } from "@mui/material";

const NewTodo = memo((props) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = title.length ? (() => {
    setError(false);
    props.onAddTodo(title);
    setTitle("");
  }) : () => setError(true);
  return (
    <>
      <TextField
        placeholder="New todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
        helperText={error && "This field can't be empty."}
      />
      <Button
        variant="outlined"
        sx={{ margin: "12px" }}
        onClick={handleSubmit}
      >
        Add
      </Button>
    </>
  );
});

export default NewTodo;
