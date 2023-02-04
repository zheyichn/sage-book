import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

function valuetext(value) {
  return `BX average rating:${value}`;
}

export default function BxRatingSlider(props) {
  const { saveBxRating } = props;
  const [value, setValue] = React.useState([0, 10]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    saveBxRating(newValue);
  };

  const marks = [
    { value: 0, label: 0 },
    { value: 2, label: 2 },
    { value: 4, label: 4 },
    { value: 6, label: 6 },
    { value: 8, label: 8 },
    { value: 10, label: 10 },
  ];

  return (
    <Box sx={{ width: 200 }} ml={1}>
      <Typography textAlign="center" color="#666666">
        BX Average Rating
      </Typography>
      <Typography
        sx={{ fontStyle: "italic" }}
        textAlign="center"
        mb={1}
        color="#666666"
      >{` ${value[0]} to ${value[1]} selected`}</Typography>
      <Slider
        // getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={0}
        step={1}
        max={10}
        marks={marks}
        color="success"
      />
    </Box>
  );
}
