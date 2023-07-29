import moment from "moment";
import { capitalize } from "@mui/material";

// Format date to DD/MM/YYYY
const formatDate = (date) => {
  const dateObject = new Date(date);
  const day = dateObject.getUTCDate().toString().padStart(2, "0");
  const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = dateObject.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

// Format date to MMMM Do YYYY
const formatOrderDate = (date) => moment(date).format("MMMM Do YYYY");

const formatDecimals = (num, decimals = 2) => {
  return (Math.round(parseFloat(num) * 100) / 100).toFixed(decimals);
};

const formatMoney = (value, currency) => {
  const decimalValue = formatDecimals(value);
  switch (currency) {
    case "dollars": {
      return `$\u00A0${decimalValue}`;
    }
    case "euros": {
      return `€\u00A0${decimalValue}`;
    }
    default: {
      console.error(`Unknown currency: ${currency}`);
      return value;
    }
  }
};

const formatLabel = (label) => {
  const split = label.split(/(?=[A-Z])|(?<=[A-Z])/g);

  return capitalize(split[0]) + " " + split.slice(1).join("");
};

export {
  formatDate,
  formatOrderDate,
  formatDecimals,
  formatMoney,
  formatLabel,
};
