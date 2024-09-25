import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

export const RatingComponent = () => {
  const [value, setValue] = React.useState(2);

  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      <Rating
        name="size-large"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        readOnly
        sx={{
          '& .MuiRating-iconFilled': {
            color: 'black',  
          },
          '& .MuiRating-iconHover': {
            color: '#FFEA00',  
          }
        }}
      />
    </Box>
  );
}
