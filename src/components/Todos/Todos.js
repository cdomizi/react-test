import { useState } from "react";
import { Box } from "@mui/system";
import { Button, Input, Typography } from "@mui/material";

// project import
import data from "../../data/data";
import TodoItem from "./TodoItem";

function Todos() {
  const [name, setName] = useState('');
  const [ items, setItems ] = useState(data);
  const reversedItems = items.map((item, index) =>
    items[items.length - index - 1]
  );
  const todoList = reversedItems.map((item, index) =>
    <TodoItem key={index} name={item}/>
  );
  
  function handleClick() {
    setName('');
    setItems([
      ...items,
      name
    ]);
  }

  return (
    <Box sx={{padding: '0px 12px'}} >
      <Typography variant="h2" gutterBottom>
        Todo List
      </Typography>

      <Input
        placeholder="New item"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button
        variant="outlined"
        sx={{ margin: "12px"}}
        onClick={handleClick}
      >
        Add
      </Button>

      {todoList}
    </Box>
  );
}

export default Todos;
