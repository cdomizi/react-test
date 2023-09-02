// Project import
import menuItems from "../../menu-items";
import ContentCard from "../../components/ContentCard";

// MUI components
import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useMemo } from "react";

const Home = () => {
  const cards = useMemo(
    () =>
      menuItems.length &&
      menuItems.map((item) => (
        <ContentCard
          key={item.id}
          title={item.title}
          url={item.url}
          icon={item.icon}
        />
      )),
    []
  );

  return (
    <Box textAlign="center">
      <Typography variant="h2" my={5}>
        Welcome to React Test
      </Typography>
      <Typography variant="h5" mb={10}>
        Browse our website
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={5}
        justifyContent="center"
      >
        {cards}
      </Stack>
    </Box>
  );
};

export default Home;
