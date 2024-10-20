import { TopLevelCondition } from "json-rules-engine";
import { logDebug } from "../utils/logger.util.ts";
import  parseCondition  from "./parse.helper.ts";
const buildConditions = (rule: string): TopLevelCondition => {
  logDebug(`Building conditions for rule: ${rule}`);

  // Handle 'OR' conditions
  const orParts = rule.split(/\sOR\s/i);
  if (orParts.length > 1) {
    logDebug(`Found 'OR' conditions`);
    return {
      any: orParts.map(buildConditions),
    };
  }

  // Handle 'AND' conditions
  const andParts = rule.split(/\sAND\s/i);
  if (andParts.length > 1) {
    logDebug(`Found 'AND' conditions`);
    return {
      all: andParts.map(parseCondition),
    };
  }

  return { all: [parseCondition(rule.trim())] };
};

export default buildConditions;
