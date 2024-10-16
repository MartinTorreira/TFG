import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export const RatingComponent = ({ rate, size = "large" }) => {
  const [value, setValue] = React.useState(2);

  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating
        name="size-large"
        size={size}
        value={rate}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        readOnly
        sx={{
          "& .MuiRating-iconFilled": {
            color: "black",
          },
          "& .MuiRating-iconHover": {
            color: "#FFEA00",
          },
        }}
      />
    </Box>
  );
};
