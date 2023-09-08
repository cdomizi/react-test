import { useReducer, useMemo, useEffect } from "react";
import { nanoid } from "nanoid";

// Project import
import NewTodo from "./NewTodo";
import TodoItem from "./TodoItem";

// MUI imoport
import { Box } from "@mui/material";
import { Typography } from "@mui/material";

const Todos = () => {
  // Get list from localStorage
  const initialTodos = useMemo(
    () => JSON.parse(localStorage.getItem("todos")) || [],
    []
  );

  const TODOS_ACTIONS = {
    ADD: "add",
    EDIT: "edit",
    DELETE: "delete",
    TOGGLE: "toggle",
    MOVE: "move",
  };

  const todosReducer = (todos, action) => {
    switch (action.type) {
      case TODOS_ACTIONS.ADD: {
        return [
          {
            id: nanoid(12),
            title: action.title,
            checked: false,
          },
          ...todos,
        ];
      }
      case TODOS_ACTIONS.EDIT: {
        return todos.map((todo) =>
          todo.id === action.id
            ? { ...todo, title: action.title.trim() }
            : { ...todo }
        );
      }
      case TODOS_ACTIONS.DELETE: {
        return todos.filter((todo) => todo.id !== action.id);
      }
      case TODOS_ACTIONS.TOGGLE: {
        return todos.map(
          (todo) =>
            (todo =
              todo.id === action.id
                ? { ...todo, checked: !action.checked }
                : { ...todo })
        );
      }
      case TODOS_ACTIONS.MOVE: {
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
        throw new Error(`Unknown action: ${action.type}`);
      }
    }
  };

  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  // Update list in localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const handleAddTodo = (value) => {
    dispatch({ type: "add", title: value.trim() });
  };

  // Edit a todo
  const handleEditTodo = (editedItem) => {
    const [id, title] = editedItem;
    dispatch({ type: "edit", id: id, title: title });
  };

  // Delete a todo
  const handleDeleteTodo = (id) => {
    dispatch({ type: "delete", id: id });
  };

  // Check/uncheck a todo
  const handleToggleTodo = (id, checked) => {
    dispatch({ type: "toggle", id: id, checked: checked });
  };

  // Move todos up/down the list
  const handleMove = (moveUp, id) => {
    dispatch({ type: "move", moveUp: moveUp, id: id });
  };

  // List todos, display checked at the bottom of the list
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
      <Typography variant="h2" mb={6}>
        Todo List
      </Typography>

      <NewTodo onAddTodo={handleAddTodo} />

      {todos.length ? todoList : <Typography>Your list is empty.</Typography>}
    </Box>
  );
};

export default Todos;
