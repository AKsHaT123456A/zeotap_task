interface ParsedCondition {
  fact: string;
  operator: string;
  value: any;
}

interface Condition {
  any?: (ParsedCondition | Condition)[];
  all?: (ParsedCondition | Condition)[];
}

  const operatorMapping: Record<string, 'greaterThan' | 'lessThan' | 'equal'> = {
    '>': 'greaterThan',
    '<': 'lessThan',
    '=': 'equal',
  };

  // Define the Node structure for the AST
interface Node {
  type: string;  // "operator" or "operand"
  left?: Node | null;  // Left child (for operators like AND/OR)
  right?: Node | null; // Right child (for operators like AND/OR)
  value?: any;  // Value for operand nodes (conditions)
}

export type { ParsedCondition ,Condition,Node};
export default operatorMapping;