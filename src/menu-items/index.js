import {
  Storefront as StorefrontIcon,
  Inventory as InventoryIcon,
  Group as GroupIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";

const icons = {
  StorefrontIcon,
  InventoryIcon,
  GroupIcon,
  FormatListBulletedIcon,
};

// project import
const menuItems = [
  {
    id: 0,
    title: "shop",
    url: "/shop",
    icon: icons.StorefrontIcon,
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
];

export default menuItems;
