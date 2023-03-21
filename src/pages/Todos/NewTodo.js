import { useState, memo } from "react";

//mui import
import { Input, Button } from "@mui/material";

const NewTodo = memo((props) => {
  const [title, setTitle] = useState("");
  return (
    <>
      <Input
        placeholder="New todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        variant="outlined"
        sx={{ margin: "12px" }}
        onClick={() => {
          props.onAddTodo(title);
          setTitle("");
        }}
      >
        Add
      </Button>
    </>
  );
});

export default NewTodo;
