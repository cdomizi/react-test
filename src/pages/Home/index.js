import { useMemo } from "react";

// Project import
import menuItems from "../../menu-items";
import ContentCard from "../../components/ContentCard";

// MUI components
import { Box, Stack } from "@mui/material";

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
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={5}
        justifyContent="center"
        useFlexGap
        mt={4}
        sx={{ flexWrap: { xs: "nowrap", md: "wrap" } }}
      >
        {cards}
      </Stack>
    </Box>
  );
};

export default Home;
