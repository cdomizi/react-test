import { memo } from "react";

import { Skeleton, Stack } from "@mui/material";

const OrderDetailSkeleton = memo(() => {
  return (
    <>
      <Skeleton
        variant="text"
        sx={{ fontSize: "5rem", maxWidth: "16rem", marginBottom: "2rem" }}
      />
      <Stack direction="row" spacing={6}>
        <Stack width="24rem">
          <Skeleton variant="text" sx={{ fontSize: "3rem", width: "24rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "3rem", width: "24rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "3rem", width: "24rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "3rem", width: "24rem" }} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "3rem", maxWidth: "7rem" }}
          />
        </Stack>
        <Stack width="20rem" spacing={2}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "3rem", maxWidth: "12rem" }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", maxWidth: "10rem" }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", maxWidth: "10rem" }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", maxWidth: "10rem" }}
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", maxWidth: "10rem" }}
          />
        </Stack>
      </Stack>
    </>
  );
});

export default OrderDetailSkeleton;
