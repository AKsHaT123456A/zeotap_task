import express, { Request, Response } from 'express';
import {
  createNewRule,
  evaluateExistingRule,
  updateRuleById,
  getAllRules,
} from '../controllers/ast.controller.ts';

// Define the expected types for the request bodies
interface CreateRuleRequestBody {
  ruleString: string;
}

interface EvaluateRuleRequestBody {
  ruleId: string;
  data: Record<string, any>;
}

interface UpdateRuleRequestBody {
  ruleId: string;
  ruleString: string;
}

const router = express.Router();

// POST: Create a new rule
router.post('/create_rule', async (req: Request<{}, {}, CreateRuleRequestBody>, res: Response) => {
  try {
    await createNewRule(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating rule' });
  }
});

// POST: Evaluate a rule with given data
router.post('/evaluate_rule', async (req: Request<{}, {}, EvaluateRuleRequestBody>, res: Response) => {
  try {
    await evaluateExistingRule(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while evaluating rule' });
  }
});

// PUT: Update an existing rule
router.put('/update_rule', async (req: Request<{}, {}, UpdateRuleRequestBody>, res: Response) => {
  try {
    await updateRuleById(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating rule' });
  }
});

// GET: Retrieve all rules
router.get('/rules', async (req: Request, res: Response) => {
  try {
    await getAllRules(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching rules' });
  }
});

export default router;
