import React from "react";
import { TextField, Button, Box } from "@mui/material";

interface RuleFormProps {
  ruleString: string;
  setRuleString: (value: string) => void;
  createRule: () => void;
  updateRule: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isEditMode: boolean;
  resetForm: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({
  ruleString,
  setRuleString,
  createRule,
  updateRule,
  isEditMode,
  resetForm,
}) => (
  <Box
    sx={{
      bgcolor: "#2a2a3a",
      padding: 2,
      borderRadius: 1,
      marginTop: 2,
      width: "100%",
    }} // Add margin top for spacing
  >
    <TextField
      label="Rule String"
      variant="outlined"
      fullWidth
      value={ruleString}
      onChange={(e) => setRuleString(e.target.value)}
      placeholder="Enter rule string"
      sx={{
        bgcolor: "#2a2a3a",
        "& .MuiInputBase-root": { color: "white" },
        "& .MuiFormLabel-root": { color: "white" },
      }}
    />

    {!isEditMode ? (
      <Button
        variant="contained"
        color="primary"
        onClick={createRule}
        fullWidth
        disabled={!ruleString}
        sx={{ mt: 2 }}
      >
        Create Rule
      </Button>
    ) : (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={updateRule}
          fullWidth
          sx={{ mb: 1, mt: 1 }} // Add margin bottom for spacing
        >
          Update Rule
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetForm}
          fullWidth
        >
          Deselect Rule
        </Button>
      </>
    )}
  </Box>
);

export default RuleForm;
