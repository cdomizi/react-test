import {
  Storefront as StorefrontIcon,
  Inventory as InventoryIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";

const icons = {
  StorefrontIcon,
  InventoryIcon,
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
    title: "inventory",
    url: "/inventory",
    icon: icons.InventoryIcon,
  },
  {
    id: 2,
    title: "todos",
    url: "/todos",
    icon: icons.FormatListBulletedIcon,
  },
];

export default menuItems;
