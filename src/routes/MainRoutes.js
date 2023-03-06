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

const MainRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route
          path="products"
          element={<Products />}
          errorElement={<ErrorPage />}
        />
      </Route>
    </Route>
  )
);

export default MainRoutes;
