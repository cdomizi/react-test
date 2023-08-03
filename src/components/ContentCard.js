// mui components
import { capitalize, Card, CardActionArea, Typography } from "@mui/material";

// mui icons
import { ArrowOutward as ArrowOutwardIcon } from "@mui/icons-material";

const ContentCard = ({ title, url, icon }) => {
  const Icon = icon;
  const itemIcon = icon ? <Icon sx={{ fontSize: "10rem" }} /> : false;
  return (
    <Card sx={{ minWidth: 275, textAlign: "center" }}>
      <CardActionArea href={url}>
        {itemIcon || <ArrowOutwardIcon />}
        <Typography variant="h3">{capitalize(title)}</Typography>
      </CardActionArea>
    </Card>
  );
};

export default ContentCard;
