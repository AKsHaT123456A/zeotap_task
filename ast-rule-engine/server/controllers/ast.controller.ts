import { Request, Response } from "express";
import { Engine, RuleProperties } from "json-rules-engine";
import Rule, { IRule } from "../models/ast.model.ts";
import { logError, logDebug } from "../utils/logger.util.ts";
import createRuleAST from "../helpers/create.helper.ts";
import { Node } from "../utils/type.util.ts";
const event = {
  type: "eligibility",
  params: {
    message: "The user is eligible.",
  },
};
// Controller for creating a new rule
export const createNewRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ruleString }: { ruleString: string } = req.body;

  try {
    // Create AST from ruleString
    const ast = createRuleAST(ruleString); // Assuming `createRuleAST` generates a valid AST based on input ruleString
    const rule: IRule = new Rule({ ruleString, ast});
    await rule.save(); // Save the rule in MongoDB

    logDebug(`Rule created and saved successfully`);
    res.json({ rule });
  } catch (error: any) {
    logError(`Error creating rule: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// Controller for evaluating a rule
interface EvaluationContext {
  [key: string]: any; // The data you will evaluate against
}

// Custom function to evaluate the AST
// Custom function to evaluate the AST
const evaluateAST = (node: Node, context: EvaluationContext): boolean => {
  if (!node) return false;
  switch (node.type) {
    case 'operand':
      const { fact, operator, value } = node.value;
      const factValue = context[fact];

      // Implement operator logic here
      switch (operator) {
        case 'greaterThan':
          return factValue > value;
        case 'equal':
          return factValue === value;
        // Add other operators as needed
        default:
          return false;
      }

    case 'operator':
      const leftResult = evaluateAST(node.left, context);
      const rightResult = evaluateAST(node.right, context);  
      switch (node.value) {
        case 'AND':
          return leftResult && rightResult;
        case 'OR':
          return leftResult || rightResult;
        default:
          return false;
      }

    default:
      return false;
  }
};

// Updated evaluateExistingRule function
export const evaluateExistingRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ruleId, data }: { ruleId: string; data: Record<string, any> } = req.body;

  try {
    logDebug(`Evaluating rule with ID: ${ruleId}`);

    const ruleDoc: IRule | null = await Rule.findById(ruleId);
    if (!ruleDoc) {
      logError(`Rule with ID: ${ruleId} not found`);
      res.status(404).json({ error: "Rule not found" });
      return;
    }

    const ast = ruleDoc.ast;
    if (!ast) {
      logError(`AST for rule with ID: ${ruleId} is missing`);
      res.status(400).json({ error: "AST is missing from the rule" });
      return;
    }

    // Evaluate the AST with the provided data
    const isEligible = evaluateAST(ast, data); // Pass the AST directly

    if (isEligible) {
      logDebug(`User eligible based on the rule`);
      res.json({ eligible: true, message: "User Eligible" });
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
export const updateRuleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ruleId, ruleString }: { ruleId: string; ruleString: string } =
    req.body;

  try {
    logDebug(`Updating rule with ID: ${ruleId}`);

    // Create new AST based on updated rule string
    const ast = createRuleAST(ruleString);
    const updatedRule: IRule | null = await Rule.findByIdAndUpdate(
      ruleId,
      { ruleString, ast },
      { new: true }
    );

    if (!updatedRule) {
      logError(`Rule with ID: ${ruleId} not found`);
      res.status(404).json({ error: "Rule not found" });
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
export const getAllRules = async (
  _req: Request,
  res: Response
): Promise<void> => {
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
