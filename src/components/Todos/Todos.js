import { useState } from "react";
import { Box } from "@mui/system";
import { Button, Input, Typography } from "@mui/material";

// project import
import data from "../../data/data";
import TodoItem from "./TodoItem";

let nextId = 0;

function Todos() {
  const [name, setName] = useState('');
  const [ items, setItems ] = useState(data);
  const todoList = items.map(item =>
    <TodoItem key={item.id} name={item.name}/>
  );
  
  function handleClick() {
    setName('');
    setItems([
      ...items,
      { id: nextId, name: name}
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
