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

export { formatMoney, formatDecimals };
