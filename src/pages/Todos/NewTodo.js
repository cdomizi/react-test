import { useState, memo } from "react";

import { Box, Button, TextField } from "@mui/material";

const NewTodo = memo((props) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);

  // Add todo only if not empty
  const handleSubmit = title.length
    ? () => {
        setError(false);
        props.onAddTodo(title);
        setTitle("");
      }
    : () => {
        setError(true);
      };

  return (
    <Box my={3}>
      <TextField
        placeholder="New todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
        helperText={error && "This field can't be empty."}
      />
      <Button variant="outlined" sx={{ margin: "12px" }} onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
});

export default NewTodo;
