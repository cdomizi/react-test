import { useState } from "react";
import { Box } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";

// project import
import data from "../../data/data";
import TodoItem from "./TodoItem";

function Todos() {
  const [ items, setItems ] = useState(data);
  const todoList = items.map(item => <TodoItem text={item}/>)

  return (
    <Box sx={{padding: '0px 12px'}} >
      <Typography variant="h2" gutterBottom>
        Todo List
      </Typography>

      <TextField id="add-item" label="New item" variant="standard" />
      <Button variant="outlined" sx={{ margin: "12px"}}>Add</Button>

      {todoList}
    </Box>
  );
}

export default Todos;
