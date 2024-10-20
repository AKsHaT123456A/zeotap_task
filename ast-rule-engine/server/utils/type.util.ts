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

export type { ParsedCondition ,Condition};
export default operatorMapping;