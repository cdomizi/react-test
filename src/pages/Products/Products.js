import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Typography, Button } from "@mui/material";

// project import
import Product from "./Product";

function Products() {
  const [number, setNumber] = useState(null);
  const data = `https://dummyjson.com/products/${number}`;
  const [product, setProduct] = useState(null);

  function handleClick() {
    setNumber(
      number => Math.ceil(Math.random() * 100)
    )
  }

  useEffect(() => {
    let ignore = false;

    async function getProduct() {
      const res = await fetch(data);
      const json = await res.json();
      !ignore && setProduct(json);
    }

    number && getProduct();

    return () => ignore = true;

  }, [data, number, product])

  return (
    <Box sx={{padding: '0px 12px'}} >
      <Typography
        variant="h2"
        align="center"
        gutterBottom
      >
        Products
      </Typography>
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{margin: '0px 0px 18px 0px'}}
      >
        Get Random Product
      </Button>
      <Box>
        {
          product && <Product {...product}/>
        }
      </Box>
    </Box>
  );
}

export default Products;
