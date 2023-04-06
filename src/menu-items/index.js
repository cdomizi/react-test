import {
  Storefront as StorefrontIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";

const icons = {
  StorefrontIcon,
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
    title: "todos",
    url: "/todos",
    icon: icons.FormatListBulletedIcon,
  },
];

export default menuItems;
