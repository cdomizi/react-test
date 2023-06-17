import {
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
  Group as GroupIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";

const icons = {
  DescriptionIcon,
  InventoryIcon,
  GroupIcon,
  FormatListBulletedIcon,
  StorefrontIcon,
};

// project import
const menuItems = [
  {
    id: 0,
    title: "invoices",
    url: "/invoices",
    icon: icons.DescriptionIcon,
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
