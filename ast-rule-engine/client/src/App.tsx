import { useState, useEffect } from 'react';
import { Box, Typography, Paper, ThemeProvider, createTheme, CssBaseline, Button, Divider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import RuleForm from './component/RuleForm';
import RuleSelect from './component/RuleSelect';
import TestDataInput from './component/RuleDataDisplay';
import ResultDisplay from './component/ResultDisplay';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [ruleString, setRuleString] = useState('(age > 30 AND department = "Sales") OR (salary > 50000 AND experience > 5)');
  const [data, setData] = useState('{"age": 35, "department": "Sales", "salary": 60000, "experience": 7}');
  const [result, setResult] = useState<boolean | null>(null);
  const [rules, setRules] = useState<{ _id: string; ruleString: string }[]>([]);
  const [selectedRule, setSelectedRule] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/rules`);
        if (!res.ok) throw new Error('Failed to fetch rules');
        const data = await res.json();
        setRules(data);
      } catch (error) {
        console.error('Error fetching rules:', error);
        toast.error('Error fetching rules. Please try again.');
      }
    };
    fetchRules();
  }, []);

  const createRule = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/create_rule`, {
        method: 'POST',
        body: JSON.stringify({ ruleString }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Error creating rule: ${errorData.error}`);
        return;
      }
      const data = await res.json();
      setRules((prev) => [...prev, data.rule]);
      setRuleString('');
      toast.success('Rule created successfully!');
    } catch (error) {
      console.error('Error creating rule:', error);
      toast.error('Error creating rule. Please try again.');
    }
  };

  const updateRule = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/update_rule`, {
        method: 'PUT',
        body: JSON.stringify({ ruleId: selectedRule, ruleString }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Error updating rule: ${errorData.error}`);
        return;
      }
      const data = await res.json();
      setRules((prev) => prev.map((rule) => (rule._id === selectedRule ? data.rule : rule)));
      toast.success('Rule updated successfully!');
    } catch (error) {
      console.error('Error updating rule:', error);
      toast.error('Error updating rule. Please try again.');
    }
  };
  const evaluateRule = async () => {
    if (!selectedRule) {
        toast.warn('Please select a rule to evaluate.');
        return;
    }
    try {
        const res = await fetch(`${BACKEND_URL}/evaluate_rule`, {
            method: 'POST',
            body: JSON.stringify({ ruleId: selectedRule, data: JSON.parse(data) }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to evaluate rule');
        const result = await res.json();
        setResult(result.eligible);
        
        // Check eligibility and display corresponding message
        if (result.eligible) {
            toast.success('The user is eligible based on the selected rule!');
        } else {
            toast.error('The user is NOT part of the required cohort based on the selected rule.');
        }
    } catch (error) {
        console.error('Error evaluating rule:', error);
        toast.error('Error evaluating rule. Please try again.');
    }
};


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#FF4081',
      },
    },
  });

  const handleSelectRule = (ruleId: React.SetStateAction<string>) => {
    const ruleToEdit = rules.find((rule) => rule._id === ruleId);
    if (ruleToEdit) {
      setSelectedRule(ruleId);
      setRuleString(ruleToEdit.ruleString);
      setIsEditMode(true);
    }
  };

  const resetForm = () => {
    setSelectedRule('');
    setRuleString('');
    setIsEditMode(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 3, 
          padding: 4,
          maxWidth: 800,
          margin: 'auto',
          mt: 4,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#1e1e2f',
        }}
        component={Paper}
        elevation={3}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          Rule Engine
        </Typography>

        <Divider sx={{ width: '100%', bgcolor: 'grey.700' }} />

        <RuleForm
          ruleString={ruleString}
          setRuleString={setRuleString}
          createRule={createRule}
          updateRule={updateRule}
          isEditMode={isEditMode}
          resetForm={resetForm}
        />

        <RuleSelect rules={rules} selectedRule={selectedRule} setSelectedRule={handleSelectRule} />

        <TestDataInput data={data} setData={setData} result={result} />
        
        <Button variant="contained" color="secondary" onClick={evaluateRule} fullWidth>
          Evaluate Rule
        </Button>

        <ResultDisplay result={result} />

        {/* Toast Container for displaying notifications */}
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
