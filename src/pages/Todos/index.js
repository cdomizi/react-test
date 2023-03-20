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

  // add a new todo
  const handleAddTodo = () => {
    const todo = {};
    todo.id = nanoid(12);
    todo.title = title.trim();
    todo.checked = false;
    setTitle("");
    setTodos([todo, ...todos]);
  };

  // edit a todo
  const handleEditTodo = (editedItem) => {
    const [id, newTitle] = editedItem;
    const newTodos = todos.map(
      (todo) =>
        (todo =
          todo.id === id ? { ...todo, title: newTitle.trim() } : { ...todo })
    );
    setTodos(newTodos);
  };

  // delete a todo
  const handleDeleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleToggleTodo = (id, checked) => {
    const newTodos = todos.map(
      (todo) =>
        (todo = todo.id === id ? { ...todo, checked: !checked } : { ...todo })
    );
    setTodos(newTodos);
  };

  // list todos
  const todoList = todos
    // sort by checked
    // display completed tasks at the bottom of the list
    .sort((a, b) => a.checked - b.checked)
    .map((todo, index) => (
      <TodoItem
        key={index}
        id={todo.id}
        value={todo.title}
        checked={todo.checked}
        onToggleTodo={() => handleToggleTodo(todo.id, todo.checked)}
        onDeleteTodo={() => handleDeleteTodo(todo.id)}
        onEditTodo={handleEditTodo}
      />
    ));

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
