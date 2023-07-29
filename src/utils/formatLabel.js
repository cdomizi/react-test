import { capitalize } from "@mui/material";

const formatLabel = (label) => {
  const split = label.split(/(?=[A-Z])|(?<=[A-Z])/g);

  return capitalize(split[0]) + " " + split.slice(1).join("");
};

export default formatLabel;
