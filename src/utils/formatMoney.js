const formatMoney = (value, currency) => {
  const decimalValue = parseFloat(value).toFixed(2);
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

export default formatMoney;
