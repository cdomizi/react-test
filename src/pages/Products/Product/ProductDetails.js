import { Box, Chip, Typography, Rating, Stack, Skeleton } from "@mui/material";

// project import
import PicsList from "../../../components/PicsList";

const ProductDetails = ({ loading, error, data }) => {
  const discountPrice = (
    ((100 - data?.discountPercentage) * data?.price) /
    100
  ).toFixed(2);

  const productSkeleton = (
    <>
      <Stack spacing={{ xs: 1, sm: 2 }} mt={8}>
        <Skeleton variant="text" sx={{ fontSize: "1rem", maxWidth: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "3rem", maxWidth: "20rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "3rem", maxWidth: "7rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", maxWidth: "9rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", maxWidth: "8rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", maxWidth: "22rem" }} />
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
          <Skeleton variant="rectangular" width="49%" height="20rem" />
          <Skeleton variant="rectangular" width="49%" height="20rem" />
        </Stack>
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
          <Skeleton variant="rectangular" width="49%" height="20rem" />
          <Skeleton variant="rectangular" width="49%" height="20rem" />
        </Stack>
      </Stack>
    </>
  );

  const Details = (
    <>
      <Typography variant="h6">{data?.brand}</Typography>
      <Typography variant="h4" gutterBottom>
        {data?.title}
      </Typography>
      <Box mb={2}>
        <Chip label={data?.category} variant="outlined" />
      </Box>
      <Rating value={Number(data?.rating)} precision={0.5} readOnly />
      <Box display="inline" ml={1}>
        {Number(data?.rating)}
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
        {data?.stock ? "in stock" : "out of stock"}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          display: "inline-block",
          color: "text.disabled",
        }}
      >
        <s>€ {data?.price}.00</s>
      </Typography>
      <Typography
        ml={2}
        sx={{
          display: "inline-block",
          color: "#d32f2f",
        }}
      >
        - {data?.discountPercentage}%
      </Typography>
      <Typography variant="h4" sx={{ color: "success.main" }} gutterBottom>
        € {discountPrice}
      </Typography>
      <Typography paragraph gutterBottom>
        {data?.description}
      </Typography>
      <PicsList images={data?.images} altText={data?.title} />
    </>
  );

  return (
    <Box textAlign="initial" mt={8}>
      {loading ? productSkeleton : Details}
    </Box>
  );
};

export default ProductDetails;
