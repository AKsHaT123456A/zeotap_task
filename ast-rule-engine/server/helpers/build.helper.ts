import { logDebug } from "../utils/logger.util.ts";
import { Condition } from "../utils/type.util.ts";
import parseCondition from "./parse.helper.ts";

// Define interfaces for the structure of conditions


// Convert the buildConditions function to TypeScript
const buildConditions = (rule: string): Condition => {
  logDebug(`Building conditions for rule: ${rule.trim()}`); // Log the input rule

  // Handle 'OR' conditions
  const orParts = rule.split(/\sOR\s/i);
  if (orParts.length > 1) {
    logDebug(`Found 'OR' conditions: ${orParts.map(part => part.trim())}`);
    return {
      any: orParts.map((orPart) => buildConditions(orPart.trim())), // Recursively build conditions for each part
    };
  }

  // Handle 'AND' conditions
  const andParts = rule.split(/\sAND\s/i);
  if (andParts.length > 1) {
    logDebug(`Found 'AND' conditions: ${andParts.map(part => part.trim())}`);
    return {
      all: andParts.map((andPart) => parseCondition(andPart.trim())), // Parse conditions for each part
    };
  }

  // If no 'AND' or 'OR' found, process as a single condition
  logDebug(`Single condition parsed: ${rule.trim()}`);
  return { all: [parseCondition(rule.trim())] };
};

export default buildConditions;
