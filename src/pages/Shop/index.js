import { useState, useEffect, useRef } from "react";

// mui components
import { Box, Typography, Button } from "@mui/material";

// project import
import RandomProduct from "./RandomProduct";

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(null);
  // product data from external API
  const data = `https://dummyjson.com/products/${number}`;
  const [product, setProduct] = useState(null);
  // AbortController to abort fetch request
  const controllerRef = useRef(null);

  // set random product id
  const handleFetchData = () => {
    setLoading(true);
    setNumber(() => Math.ceil(Math.random() * 100));
  };

  // abort fetch product data request
  const handleStopFetching = () => {
    controllerRef && controllerRef.current?.abort();
    setLoading(false);
  };

  // fetch product data when a new id is provided
  useEffect(() => {
    const abortController = new AbortController();
    controllerRef.current = abortController;
    const getProduct = async () => {
      try {
        const res = await fetch(data, { signal: controllerRef.current.signal });
        const json = await res.json();
        // do not set the product if the user stops the request
        if (controllerRef.current.signal?.aborted) {
          return;
        } else {
          setProduct(json);
        }
        setLoading(false);
      } catch (e) {
        controllerRef.current.signal.aborted
          ? console.log("The user aborted the request.")
          : console.error(`Error while fetching product data: ${e}`) &&
            setLoading(false);
      }
    };

    number && getProduct();

    return function cleanup() {
      abortController.abort();
    };
  }, [data, number, controllerRef]);

  return (
    <Box sx={{ py: 3, textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Shop
      </Typography>
      <Button
        variant="contained"
        onClick={handleFetchData}
        sx={{
          mb: 3,
          width: "14rem",
          borderRadius: "1.25rem",
          display: loading ? "none" : "default",
        }}
      >
        Get Random Product
      </Button>
      <Button
        variant="contained"
        onClick={handleStopFetching}
        sx={{
          mb: 3,
          width: "14rem",
          borderRadius: "1.25rem",
          display: loading ? "default" : "none",
        }}
      >
        Stop
      </Button>
      <Box>
        {(loading || product) && (
          <RandomProduct loading={loading} {...product} />
        )}
      </Box>
    </Box>
  );
};

export default Shop;
