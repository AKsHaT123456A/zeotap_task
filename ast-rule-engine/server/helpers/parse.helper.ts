// Define types for the parsed condition

import type { ParsedCondition } from "../utils/type.util.ts";
import operatorMapping from "../utils/type.util.ts";

  
  // Operator mapping for cleaner handling

  
  /**
   * Function to parse a condition string and return the parsed condition
   * @param conditionString - The condition string to be parsed (e.g., "age > 25")
   * @returns ParsedCondition object containing fact, operator, and value
   * @throws Error if the condition string format is invalid
   */
  const parseCondition = (conditionString: string): ParsedCondition => {
    const regex = /(\w+)\s*(>|<|=)\s*([^\s]+)/;
    const match = conditionString.match(regex);
  
    if (!match) {
      throw new Error(`Invalid condition format: ${conditionString}`);
    }
  
    const [ , fact, operatorSymbol, rawValue ] = match;
  
    // Get operator from mapping, throw error if not valid
    const operator = operatorMapping[operatorSymbol];
    if (!operator) {
      throw new Error(`Unknown operator: ${operatorSymbol}`);
    }
  
    // Parse the value: either a number or a string, cleaned from quotes or parentheses
    const cleanValue = rawValue.replace(/[()'"]/g, '');
    const value = isNaN(Number(cleanValue)) ? cleanValue : Number(cleanValue);
  
    return {
      fact,
      operator,
      value,
    };
  };


  export default parseCondition
  