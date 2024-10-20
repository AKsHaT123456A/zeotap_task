import { logDebug } from "../utils/logger.util.ts";
import buildConditions from "./build.helper.ts";

// Function to create rule structure from string
const createRule = (ruleString: string) => {
  logDebug(`Creating rule from string: ${ruleString}`);

  return {
    conditions: buildConditions(ruleString),
    event: {
      type: "eligibility",
      params: {
        message: "The user is eligible.",
      },
    },
  };
};

export default createRule;
