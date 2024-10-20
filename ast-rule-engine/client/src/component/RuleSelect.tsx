import React from 'react';
import { Select, MenuItem } from '@mui/material';

interface RuleSelectProps {
  rules: { _id: string; ruleString: string }[];
  selectedRule: string;
  setSelectedRule: (ruleId: string) => void;
}

const RuleSelect: React.FC<RuleSelectProps> = ({ rules, selectedRule, setSelectedRule }) => (
  <Select
    value={selectedRule}
    onChange={(e) => setSelectedRule(e.target.value)}
    fullWidth
    displayEmpty
    sx={{ bgcolor: '#2a2a3a', '& .MuiSelect-root': { color: 'white' }, '& .MuiInputBase-root': { color: 'white' }}}
  >
    <MenuItem value="" disabled>
      Select a rule to modify or evaluate
    </MenuItem>
    {rules.map((rule) => (
      <MenuItem key={rule._id} value={rule._id}>
        {rule.ruleString}
      </MenuItem>
    ))}
  </Select>
);

export default RuleSelect;
