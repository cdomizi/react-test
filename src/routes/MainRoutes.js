import loadable from "@loadable/component";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// project import
const RootLayout = loadable(() => import("../layouts/RootLayout"));
const ErrorPage = loadable(() => import("../pages/Error"));
const Login = loadable(() => import("../pages/Auth/Login"));
const Register = loadable(() => import("../pages/Auth/Register"));
const Home = loadable(() => import("../pages/Home"));
const Orders = loadable(() => import("../pages/Orders"));
const Order = loadable(() => import("../pages/Orders/Order"));
const Products = loadable(() => import("../pages/Products"));
const Product = loadable(() => import("../pages/Products/Product"));
const Customers = loadable(() => import("../pages/Customers"));
const Customer = loadable(() => import("../pages/Customers/Customer"));
const Todos = loadable(() => import("../pages/Todos"));
const Shop = loadable(() => import("../pages/Shop"));

const MainRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId" element={<Order />} />
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
