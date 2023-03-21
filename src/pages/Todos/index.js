import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

// project import
import NewTodo from "./NewTodo";
import TodoItem from "./TodoItem";

function Todos() {
  // get list from localStorage
  const [todos, setTodos] = useState(
    () => JSON.parse(localStorage.getItem("todos")) || []
  );

  // update list in localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // add a new todo
  const handleAddTodo = (value) => {
    const todo = {};
    todo.id = nanoid(12);
    todo.title = value.trim();
    todo.checked = false;
    setTodos([todo, ...todos]);
  };

  // edit a todo
  const handleEditTodo = (editedItem) => {
    const [id, title] = editedItem;
    const newList = todos.map(
      (todo) =>
        (todo = todo.id === id ? { ...todo, title: title.trim() } : { ...todo })
    );
    setTodos(newList);
  };

  // delete a todo
  const handleDeleteTodo = (id) => {
    const newList = todos.filter((todo) => todo.id !== id);
    setTodos(newList);
  };

  const handleToggleTodo = (id, checked) => {
    const newList = todos.map(
      (todo) =>
        (todo = todo.id === id ? { ...todo, checked: !checked } : { ...todo })
    );
    setTodos(newList);
  };

  // list todos
  // sort by checked
  // display completed tasks at the bottom of the list
  const todoList = todos
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

      <NewTodo onAddTodo={handleAddTodo} />

      {todos.length ? todoList : <Typography>Your list is empty.</Typography>}
    </Box>
  );
}

export default Todos;
