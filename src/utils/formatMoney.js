const formatMoney = (value, currency) => {
  const decimalValue = parseFloat(value).toFixed(2);
  switch (currency) {
    case "dollars": {
      return `$ ${decimalValue}`;
    }
    case "euros": {
      return `€ ${decimalValue}`;
    }
    default: {
      console.error(`Unknown currency: ${currency}`);
      return value;
    }
  }
};

export default formatMoney;
