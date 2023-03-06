import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// project import
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../pages/Error/ErrorPage";
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import Todos from "../pages/Todos/Todos";

const MainRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="todos" element={<Todos />} />
      </Route>
    </Route>
  )
);

export default MainRoutes;
