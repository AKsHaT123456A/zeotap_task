import { logDebug } from "../utils/logger.util.ts";
import { Node } from "../utils/type.util.ts";  // Adjust imports for Node type
import parseCondition from "./parse.helper.ts";

// Function to build conditions into an AST using Node structure
const buildConditions = (rule: string): Node => {
  logDebug(`Building conditions for rule: ${rule.trim()}`);

  // Handle 'OR' conditions
  const orParts = rule.split(/\sOR\s/i);
  if (orParts.length > 1) {
    logDebug(`Found 'OR' conditions: ${orParts.map(part => part.trim())}`);
    return {
      type: 'operator',
      value: 'OR',
      left: buildConditions(orParts[0].trim()),  // Recursively build the left part
      right: buildConditions(orParts.slice(1).join(' OR ').trim()),  // Right part with remaining conditions
    };
  }

  // Handle 'AND' conditions
  const andParts = rule.split(/\sAND\s/i);
  if (andParts.length > 1) {
    logDebug(`Found 'AND' conditions: ${andParts.map(part => part.trim())}`);
    return {
      type: 'operator',
      value: 'AND',
      left: buildConditions(andParts[0].trim()),  // Recursively build the left part
      right: buildConditions(andParts.slice(1).join(' AND ').trim()),  // Right part with remaining conditions
    };
  }

  // Single condition (operand)
  logDebug(`Single condition parsed: ${rule.trim()}`);
  const condition = parseCondition(rule.trim());  // Parse the condition
  return {
    type: 'operand',
    value: condition,
    left: null,
    right: null,
  };
};

export default buildConditions;
