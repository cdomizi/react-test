import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Box } from "@mui/system";
import { Button, Input, Typography } from "@mui/material";

// project import
import TodoItem from "./TodoItem";

function Todos() {
  // get list from localStorage
  const [todos, setTodos] = useState(
    () => JSON.parse(localStorage.getItem("todos")) || []
  );
  const [title, setTitle] = useState("");

  // update list in localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // sort todos by last created
  const reversedTodos = todos.map(
    (todo, index) => todos[todos.length - index - 1]
  );
  const todoList = reversedTodos.map((todo, index) => (
    <TodoItem
      key={index}
      value={todo.title}
      onDeleteTodo={() => handleDeleteTodo(todo.id)}
    />
  ));

  // add a new todo
  function handleAddTodo() {
    const todo = {};
    todo.id = nanoid(12);
    todo.title = title;
    setTitle("");
    setTodos([...todos, todo]);
  }

  // delete a todo
  function handleDeleteTodo(id) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  return (
    <Box sx={{ padding: "0px 12px" }}>
      <Typography variant="h2" gutterBottom>
        Todo List
      </Typography>

      <Input
        placeholder="New todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        variant="outlined"
        sx={{ margin: "12px" }}
        onClick={handleAddTodo}
      >
        Add
      </Button>

      {todoList.length ? (
        todoList
      ) : (
        <Typography>Your list is empty.</Typography>
      )}
    </Box>
  );
}

export default Todos;
