import { Box, Chip, Typography, Rating } from "@mui/material";

// project import
import Images from "./Images";

const Product = (props) => {
  const discountPrice = (
    ((100 - props.discountPercentage) * props.price) /
    100
  ).toFixed(2);

  return (
    <Box textAlign="initial" mt={8}>
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
    </Box>
  );
}

export default Product;
