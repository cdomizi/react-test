import {
  ShoppingBag as ShoppingBagIcon,
  Inventory as InventoryIcon,
  Group as GroupIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";

const icons = {
  ShoppingBagIcon,
  InventoryIcon,
  GroupIcon,
  FormatListBulletedIcon,
  StorefrontIcon,
};

// project import
const menuItems = [
  {
    id: 0,
    title: "orders",
    url: "/orders",
    icon: icons.ShoppingBagIcon,
  },
  {
    id: 1,
    title: "products",
    url: "/products",
    icon: icons.InventoryIcon,
  },
  {
    id: 2,
    title: "customers",
    url: "/customers",
    icon: icons.GroupIcon,
  },
  {
    id: 3,
    title: "todos",
    url: "/todos",
    icon: icons.FormatListBulletedIcon,
  },
  {
    id: 4,
    title: "shop",
    url: "/shop",
    icon: icons.StorefrontIcon,
  },
];

export default menuItems;
