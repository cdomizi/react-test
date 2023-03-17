import { useState, useEffect } from "react";

// mui components
import { Box, Typography, Button } from "@mui/material";

// project import
import Product from "./Product";

function Products() {
  const [number, setNumber] = useState(null);
  // get product data from external API
  const data = `https://dummyjson.com/products/${number}`;
  const [product, setProduct] = useState(null);

  // set random product id
  function handleClick() {
    setNumber(() => Math.ceil(Math.random() * 100));
  }

  // fetch product data when a new id is provided
  useEffect(() => {
    let ignore = false;

    async function getProduct() {
      try {
        const res = await fetch(data);
        const json = await res.json();
        !ignore && setProduct(json);
      } catch (e) {
        console.error(`Error while fetching product: ${e}`);
      }
    }

    number && getProduct();

    return () => (ignore = true);
  }, [data, number, product]);

  return (
    <Box sx={{ padding: "0px 12px", textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Products
      </Typography>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ margin: "0px 0px 18px 0px", borderRadius: "1.25rem" }}
      >
        Get Random Product
      </Button>
      <Box>{product && <Product {...product} />}</Box>
    </Box>
  );
}

export default Products;
