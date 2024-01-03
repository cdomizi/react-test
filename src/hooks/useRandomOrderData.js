import { useEffect } from "react";
import getRandomInt from "utils/getRandomInt";

let state = { loading: false, data: undefined };

const useRandomOrderData = (productsData, customerData, reload = null) => {
  useEffect(() => {
    if (!(productsData && customerData)) return;

    // Disable "Fill with random data" button
    state.loading = true;

    // Get an array of 1 to 3 random products
    const allProducts = [...productsData];
    const randomProductsCount = getRandomInt(3);
    const getUniqueId = () => {
      const removedId = allProducts?.splice(
        getRandomInt(allProducts?.length - 1, 0),
        1
      )[0];
      return removedId;
    };

    const randomProducts = [];
    let i = 0;
    while (i < randomProductsCount) {
      randomProducts.push({
        product: getUniqueId(),
        quantity: getRandomInt(3),
      });
      i++;
    }

    // Get a random customer
    const randomCustomer = () => {
      const randomInt = getRandomInt(customerData?.length - 1);
      return customerData?.[randomInt];
    };

    // Get a random boolean value for the invoice
    const randomBoolean = Boolean(getRandomInt(2, 0));

    // Fill form fields
    state.data = {
      ...state?.data,
      customer: randomCustomer(),
      products: randomProducts,
      invoice: randomBoolean,
    };

    state.loading = false;
  }, [customerData, productsData, reload]);

  return state;
};

export default useRandomOrderData;
