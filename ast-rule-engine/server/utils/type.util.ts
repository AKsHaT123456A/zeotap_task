interface ParsedCondition {
    fact: string;
    operator: 'greaterThan' | 'lessThan' | 'equal';
    value: string | number;
  }
  const operatorMapping: Record<string, 'greaterThan' | 'lessThan' | 'equal'> = {
    '>': 'greaterThan',
    '<': 'lessThan',
    '=': 'equal',
  };

export type { ParsedCondition };
export default operatorMapping;