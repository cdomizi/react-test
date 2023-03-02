import { createBrowserRouter, RouterProvider } from "react-router-dom";

// project import
import Layout from "./routes/Layout";
import ErrorPage from "./components/Error/ErrorPage";
import Main from "./components/Main/Main";
import Products from "./components/Products/Products";

// mui components
import { CssBaseline, Box } from "@mui/material";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Main /> },
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
]);

function App() {
  return (
    <Box className="App">
      <CssBaseline />
      <RouterProvider router={router} />
    </Box>
  );
}

export default App;
