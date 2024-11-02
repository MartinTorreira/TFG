import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export const RatingComponent = ({ rate, size = "large", onChange, editable = false }) => {
  const [value, setValue] = useState(rate);

  useEffect(() => {
    setValue(rate);
  }, [rate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ "& > legend": { mt: 2 } }}>
      <Rating
        name="size-large"
        size={size}
        value={value}
        onChange={editable ? handleChange : null}
        readOnly={!editable}
        sx={{
          "& .MuiRating-iconFilled": {
            color: "black",
          },
          "& .MuiRating-iconHover": {
            color: "black",
          },
        }}
      />
    </Box>
  );
};