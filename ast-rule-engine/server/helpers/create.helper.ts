import { logDebug } from "../utils/logger.util.ts";
import buildConditions from "./build.helper.ts";
import { Node } from "../utils/type.util.ts";  // Assuming Node is defined in type.util.ts
const event = {
  type: "eligibility",
  params: {
    message: "The user is eligible.",
  },
};
// Function to create rule structure from string
const createASTRule = (ruleString: string): Node => {
  logDebug(`Creating AST from rule string: ${ruleString}`);

  // Build the conditions using the buildConditions helper
  const conditionsNode: Node = buildConditions(ruleString);

  // Return the root node, which will either be a single condition or an operator with child nodes
  const rootNode: Node = {
    type: "operator",
    left: conditionsNode.left || null,  // Left child node (if any)
    right: conditionsNode.right || null, // Right child node (if any)
    value: conditionsNode.value || null,  // Value for operand node (if it's a leaf)
  };

  return rootNode;
};

export default createASTRule;
