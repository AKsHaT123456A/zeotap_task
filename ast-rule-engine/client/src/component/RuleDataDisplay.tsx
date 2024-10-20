import React from "react";
import { TextField } from "@mui/material";

interface TestDataInputProps {
  data: string;
  result: boolean | null;
  setData: (data: string) => void;
}

const TestDataInput: React.FC<TestDataInputProps> = ({
  data,
  setData,
  result,
}) => {
  const borderColor =
    result === true ? "green" : result === false ? "red" : "#ccc";

  return (
    <TextField
      label="Test Data"
      multiline
      rows={4}
      variant="outlined"
      fullWidth
      value={data}
      onChange={(e) => setData(e.target.value)}
      placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 7}'
      sx={{
        bgcolor: "#2a2a3a",
        "& .MuiInputBase-root": { color: "white" },
        "& .MuiFormLabel-root": { color: "white" },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: borderColor,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: borderColor,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: borderColor,
        },
      }}
    />
  );
};

export default TestDataInput;
