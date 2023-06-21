const formatDate = (date) => {
  const dateObject = new Date(date);
  const day = dateObject.getUTCDate();
  const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = dateObject.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

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

export { formatDate, formatDecimals, formatMoney };
