import React from 'react';
import { Typography } from '@mui/material';

interface ResultDisplayProps {
  result: boolean | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (result === null) return null;

  return (
    <Typography variant="h6" color={result ? 'lime' : 'red'}>
      Eligibility: {result ? 'Yes' : 'No'}
    </Typography>
  );
};

export default ResultDisplay;
