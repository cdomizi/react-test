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
const Orders = loadable(() => import("../pages/Orders"));
const Products = loadable(() => import("../pages/Products"));
const Product = loadable(() => import("../pages/Products/Product/Product"));
const Customers = loadable(() => import("../pages/Customers"));
const Customer = loadable(() => import("../pages/Customers/Customer"));
const Todos = loadable(() => import("../pages/Todos"));
const Shop = loadable(() => import("../pages/Shop"));

const MainRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:productId" element={<Product />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:customerId" element={<Customer />} />
        <Route path="todos" element={<Todos />} />
        <Route path="shop" element={<Shop />} />
      </Route>
    </Route>
  )
);

export default MainRoutes;
