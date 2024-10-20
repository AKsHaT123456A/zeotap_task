import { logError, logDebug } from '../utils/logger.ts';

const operatorMapping: Record<string, string> = {
  '>': 'greaterThan',
  '<': 'lessThan',
  '=': 'equal'
};

const parsingCondition = (condition: string) => {
  logDebug(`Parsing condition: ${condition}`);

  const parsed = condition.match(/(\w+)\s*(>|<|=)\s*([^\s()'"]+)/);
  if (!parsed) {
    const errorMsg = `Invalid condition format: ${condition}`;
    logError(errorMsg);
    throw new Error(errorMsg);
  }

  const [ , factName, operatorSymbol, valueString ] = parsed;

  const operator = operatorMapping[operatorSymbol];
  if (!operator) {
    const errorMsg = `Unknown operator: ${operatorSymbol} in condition: ${condition}`;
    logError(errorMsg);
    throw new Error(errorMsg);
  }

  const value = isNaN(Number(valueString)) ? valueString : Number(valueString);

  logDebug(`Parsed fact: ${factName}, operator: ${operator}, value: ${value}`);
  
  return {
    fact: factName,
    operator,
    value
  };
};



module.exports= {parsingCondition}