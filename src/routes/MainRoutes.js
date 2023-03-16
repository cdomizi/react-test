import loadable from "@loadable/component";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// project import
const RootLayout = loadable(() => import("../layouts/RootLayout"));
const ErrorPage = loadable(() => import("../pages/Error"));
const Home = loadable(() => import("../pages/Home/Home"));
const Products = loadable(() => import("../pages/Products"));
const Todos = loadable(() => import("../pages/Todos"));

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
