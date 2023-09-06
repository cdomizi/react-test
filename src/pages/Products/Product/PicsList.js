import { Box, ImageList, ImageListItem } from "@mui/material";

const PicsList = (props) => {
  return (
    <Box>
      {props.images && (
        <ImageList variant="masonry" vcols={3} gap={8}>
          {props.images.map((image, index) => (
            <ImageListItem key={index}>
              <img
                src={`${image}?w=248&fit=crop&auto=format`}
                srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={`${props?.altText} #${index}`}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default PicsList;
