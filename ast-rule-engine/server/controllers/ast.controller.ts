import { Request, Response } from 'express';
import { Engine, RuleProperties } from 'json-rules-engine';
import Rule, { IRule } from '../models/ast.model.ts';
import { logError, logDebug } from '../utils/logger.ts';
import buildConditions from '../helpers/build.helper.ts';

// Function to create rule structure from string
const createRule = (ruleString: string): RuleProperties => {
  logDebug(`Creating rule from string: ${ruleString}`);

  return {
    conditions: buildConditions(ruleString),
    event: {
      type: 'eligibility',
      params: {
        message: 'The user is eligible.',
      },
    },
  };
};

// Controller for creating a new rule
export const createNewRule = async (req: Request, res: Response): Promise<void> => {
  const { ruleString }: { ruleString: string } = req.body;

  try {
    logDebug(`Received rule creation request with rule: ${ruleString}`);
    const ast = createRule(ruleString);

    const rule: IRule = new Rule({ ruleString, ast });
    await rule.save();

    logDebug(`Rule created and saved successfully`);
    res.json({ rule });
  } catch (error: any) {
    logError(`Error creating rule: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// Controller for evaluating a rule
export const evaluateExistingRule = async (req: Request, res: Response): Promise<void> => {
  const { ruleId, data }: { ruleId: string; data: Record<string, any> } = req.body;

  try {
    logDebug(`Evaluating rule with ID: ${ruleId}`);

    const ruleDoc: IRule | null = await Rule.findById(ruleId);
    if (!ruleDoc) {
      logError(`Rule with ID: ${ruleId} not found`);
      res.status(404).json({ error: 'Rule not found' });
      return;
    }

    if (!ruleDoc.ast || !ruleDoc.ast.event || !ruleDoc.ast.conditions) {
      const errorMsg = "Rule is missing the required 'conditions' or 'event' properties";
      logError(errorMsg);
      res.status(400).json({ error: errorMsg });
      return;
    }

    const engine = new Engine();

    try {
      engine.addRule(ruleDoc.ast as unknown as RuleProperties);
    } catch (error: any) {
      logError(`Error adding rule to engine: ${error.message}`);
      res.status(500).json({ error: error.message });
      return;
    }

    const { events } = await engine.run(data);

    if (events.length > 0) {
      logDebug(`User eligible based on the rule`);
      res.json({ eligible: true });
    } else {
      logDebug(`User not eligible based on the rule`);
      res.json({ eligible: false });
    }
  } catch (error: any) {
    logError(`Error evaluating rule: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Controller for updating an existing rule
export const updateRuleById = async (req: Request, res: Response): Promise<void> => {
  const { ruleId, ruleString }: { ruleId: string; ruleString: string } = req.body;

  try {
    logDebug(`Updating rule with ID: ${ruleId}`);

    const ast = createRule(ruleString);
    const updatedRule: IRule | null = await Rule.findByIdAndUpdate(ruleId, { ruleString, ast }, { new: true });

    if (!updatedRule) {
      logError(`Rule with ID: ${ruleId} not found`);
      res.status(404).json({ error: 'Rule not found' });
      return;
    }

    logDebug(`Rule updated successfully`);
    res.json({ rule: updatedRule });
  } catch (error: any) {
    logError(`Error updating rule: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// Controller for retrieving all rules
export const getAllRules = async (_req: Request, res: Response): Promise<void> => {
  try {
    logDebug(`Fetching all rules from the database`);

    const rules: IRule[] = await Rule.find({});
    res.json(rules);

    logDebug(`Successfully fetched ${rules.length} rules`);
  } catch (error: any) {
    logError(`Error fetching rules: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
