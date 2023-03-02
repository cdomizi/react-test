import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function Images(props) {

  return (
    <Box sx={{ width: 500, height: 450,}}>
      <ImageList variant="masonry" vcols={3} gap={8}>
        {props.images.map((image, index) => (
          <ImageListItem key={index}>
            <img
              src={`${image}?w=248&fit=crop&auto=format`}
              srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt="product image"
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default Images;
