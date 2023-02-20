import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Button, Input, Typography } from "@mui/material";

// project import
import TodoItem from "./TodoItem";

function Todos() {
  // get list from localStorage
  const data = JSON.parse(localStorage.getItem("items"));
  const [ items, setItems ] = useState(data || []);
  const [ title, setTitle ] = useState("");

  // update list in localStorage
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);
  
  // sort todos by last created
  const reversedItems = items.map((item, index) =>
    items[items.length - index - 1]
  );
  const todoList = reversedItems.map((item, index) =>
    <TodoItem key={index} name={item}/>
  );
  
  // add a new todo
  function onAddItem() {
    setTitle("");
    setItems([
      ...items,
      title
    ]);
  }

  return (
    <Box sx={{padding: "0px 12px"}} >
      <Typography variant="h2" gutterBottom>
        Todo List
      </Typography>

      <Input
        placeholder="New item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Button
        variant="outlined"
        sx={{ margin: "12px"}}
        onClick={onAddItem}
      >
        Add
      </Button>

      {
        todoList.length ?
          todoList :
          <Typography>Your list is empty.</Typography>
      }
    </Box>
  );
}

export default Todos;
