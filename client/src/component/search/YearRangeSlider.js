import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

function valuetext(value) {
  return `publish year:${value}`;
}

export default function RangeSlider(props) {
  const { saveYear } = props;
  const [value, setValue] = React.useState([0, 2020]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    saveYear(newValue);
  };

  const marks = [
    { value: 0, label: "0 AD" },
    { value: 500, label: 400 },
    { value: 1000, label: 1000 },
    { value: 1500, label: 1500 },
    { value: 2022, label: "2022 AD" },
  ];

  return (
    <Box sx={{ width: 350 }}>
      <Typography textAlign="center" color="#666666">
        Year Published
      </Typography>
      <Typography
        sx={{ fontStyle: "italic" }}
        textAlign="center"
        mb={1}
        color="#666666"
      >{` ${value[0]} to ${value[1]} selected`}</Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={0}
        step={1}
        max={2022}
        color="success"
        marks={marks}
      />
    </Box>
  );
}
