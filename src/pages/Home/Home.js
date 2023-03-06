// project import
import menuItems from "../../menu-items";
import ContentCard from "../../components/ContentCard";

// mui components
import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";

const Home = () => {
  const cards =
    menuItems.length &&
    menuItems.map((item) => (
      <ContentCard
        key={item.id}
        title={item.title}
        url={item.url}
        icon={item.icon}
      />
    ));

  return (
    <Box textAlign="center">
      <Typography variant="h2" my={5}>
        Welcome to React Test
      </Typography>
      <Typography variant="h5" mb={10}>
        Browse our website
      </Typography>
      <Stack direction="row" spacing={2}>
        {cards}
      </Stack>
    </Box>
  );
};

export default Home;
