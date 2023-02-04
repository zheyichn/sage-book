import { TextField } from "@mui/material";
import { useState } from "react";

export default function SearchInput(props) {
  const { inputLabel = "", saveText } = props;
  const [value, setValue] = useState("");

  return (
    <TextField
      color="success"
      label={inputLabel}
      variant="outlined"
      onChange={(e) => {
        setValue(e.target.value);
        saveText(e.target.value);
      }}
      value={value}
    />
  );
}
