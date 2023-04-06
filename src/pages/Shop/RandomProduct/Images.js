import { Box, ImageList, ImageListItem } from "@mui/material";

const Images = (props) => {
  return (
    <Box>
      <ImageList variant="masonry" vcols={3} gap={8}>
        {props.images.map((image, index) => (
          <ImageListItem key={index}>
            <img
              src={`${image}?w=248&fit=crop&auto=format`}
              srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt="some product"
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default Images;
