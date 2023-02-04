import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

function valuetext(value) {
  return `Amazon average rating:${value}`;
}

export default function AmznRatingSlider(props) {
  const { saveAmznRating } = props;
  const [value, setValue] = React.useState([0, 5]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    saveAmznRating(newValue);
  };
  const marks = [
    { value: 0, label: 0 },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
  ];

  return (
    <Box sx={{ width: 180 }} ml={1}>
      <Typography textAlign="center" color="#666666">
        Amazon Average Rating
      </Typography>
      <Typography
        sx={{ fontStyle: "italic" }}
        textAlign="center"
        mb={1}
        color="#666666"
      >{` ${value[0]} to ${value[1]} selected`}</Typography>
      <Slider
        marks={marks}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={0}
        step={1}
        max={5}
        color="success"
      />
    </Box>
  );
}
