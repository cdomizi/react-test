import { useNavigate } from "react-router";

// Mui components & icons
import { capitalize, Card, CardActionArea, Typography } from "@mui/material";
import { ArrowOutward as ArrowOutwardIcon } from "@mui/icons-material";

const ContentCard = ({ title, url, icon }) => {
  const navigate = useNavigate();

  const Icon = icon;
  const itemIcon = icon ? <Icon sx={{ fontSize: "10rem" }} /> : false;

  return (
    <Card
      raised={true}
      sx={{ minWidth: 275, textAlign: "center", borderRadius: "2%" }}
    >
      <CardActionArea onClick={() => navigate(url)}>
        {itemIcon || <ArrowOutwardIcon />}
        <Typography variant="h3">{capitalize(title)}</Typography>
      </CardActionArea>
    </Card>
  );
};

export default ContentCard;
