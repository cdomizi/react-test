import { useReducer, useMemo, useEffect } from "react";
import { nanoid } from "nanoid";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

// project import
import NewTodo from "./NewTodo";
import TodoItem from "./TodoItem";

const Todos = () => {
  // get list from localStorage
  const initialTodos = useMemo(
    () => JSON.parse(localStorage.getItem("todos")) || [],
    []
  );

  const todosReducer = (todos, action) => {
    switch (action.type) {
      case "add": {
        return [
          {
            id: nanoid(12),
            title: action.title,
            checked: false,
          },
          ...todos,
        ];
      }
      case "edit": {
        return todos.map((todo) =>
          todo.id === action.id
            ? { ...todo, title: action.title.trim() }
            : { ...todo }
        );
      }
      case "delete": {
        return todos.filter((todo) => todo.id !== action.id);
      }
      case "toggle": {
        return todos.map(
          (todo) =>
            (todo =
              todo.id === action.id
                ? { ...todo, checked: !action.checked }
                : { ...todo })
        );
      }
      case "move": {
        const index = todos.findIndex((todo) => todo.id === action.id);
        const newList = [...todos];
        action.moveUp
          ? ([newList[index], newList[index - 1]] = [
              newList[index - 1],
              newList[index],
            ])
          : ([newList[index], newList[index + 1]] = [
              newList[index + 1],
              newList[index],
            ]);
        return newList;
      }
      default: {
        throw Error(`Unknown action: ${action.type}`);
      }
    }
  };

  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  // update list in localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // add a new todo
  const handleAddTodo = (value) => {
    dispatch({ type: "add", title: value.trim() });
  };

  // edit a todo
  const handleEditTodo = (editedItem) => {
    const [id, title] = editedItem;
    dispatch({ type: "edit", id: id, title: title });
  };

  // delete a todo
  const handleDeleteTodo = (id) => {
    dispatch({ type: "delete", id: id });
  };

  const handleToggleTodo = (id, checked) => {
    dispatch({ type: "toggle", id: id, checked: checked });
  };

  const handleMove = (moveUp, id) => {
    dispatch({ type: "move", moveUp: moveUp, id: id });
  };

  // list todos
  // sort by checked
  // display completed tasks at the bottom of the list
  const todoList = todos
    .sort((a, b) => a.checked - b.checked)
    .map((todo, index) => (
      <TodoItem
        key={index}
        position={[
          index === 0,
          index === todos.filter((todo) => !todo.checked).length - 1,
        ]}
        id={todo.id}
        value={todo.title}
        checked={todo.checked}
        onToggleTodo={() => handleToggleTodo(todo.id, todo.checked)}
        onDeleteTodo={() => handleDeleteTodo(todo.id)}
        onEditTodo={handleEditTodo}
        onMove={handleMove}
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
};

export default Todos;
