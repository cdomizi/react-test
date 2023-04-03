import { Box, Chip, Typography, Rating, Stack, Skeleton } from "@mui/material";

// project import
import Images from "./Images";

const Product = (props) => {
  const discountPrice = (
    ((100 - props.discountPercentage) * props.price) /
    100
  ).toFixed(2);

  const productSkeleton = (
    <>
      <Stack spacing={{ xs: 1, sm: 2 }} mt={8}>
        <Skeleton variant="text" sx={{ fontSize: "1rem", maxWidth: "20%" }} />
        <Skeleton variant="text" sx={{ fontSize: "3rem", maxWidth: "40%" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", maxWidth: "25%" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", maxWidth: "30%" }} />
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
          <Skeleton variant="rectangular" width="15rem" height="18rem" />
          <Skeleton variant="rectangular" width="15rem" height="18rem" />
        </Stack>
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
          <Skeleton variant="rectangular" width="15rem" height="20rem" />
          <Skeleton variant="rectangular" width="15rem" height="20rem" />
        </Stack>
      </Stack>
    </>
  );

  const productData = (
    <>
      <Typography variant="h6">{props.brand}</Typography>
      <Typography variant="h4" gutterBottom>
        {props.title}
      </Typography>
      <Box mb={2}>
        <Chip label={props.category} variant="outlined" />
      </Box>
      <Rating value={props.rating} precision={0.5} readOnly />
      <Box display="inline" ml={1}>
        {props.rating}
        <Typography
          sx={{
            display: "inline",
            ml: 1,
            color: "text.disabled",
            fontSize: "small",
          }}
        >
          / 5.00
        </Typography>
      </Box>
      <Typography paragraph variant="button" gutterBottom>
        {props.stock ? "in stock" : "out of stock"}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          display: "inline-block",
          color: "text.disabled",
        }}
      >
        <s>€ {props.price}.00</s>
      </Typography>
      <Typography
        ml={2}
        sx={{
          display: "inline-block",
          color: "#d32f2f",
        }}
      >
        - {props.discountPercentage}%
      </Typography>
      <Typography variant="h4" sx={{ color: "success.main" }} gutterBottom>
        € {discountPrice}
      </Typography>
      <Typography paragraph gutterBottom>
        {props.description}
      </Typography>
      <Images images={props.images} />
    </>
  );

  return (
    <Box textAlign="initial" mt={8}>
      {props.loading ? productSkeleton : productData}
    </Box>
  );
};

export default Product;
