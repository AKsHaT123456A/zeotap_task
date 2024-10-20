import mongoose, { Schema, Document, model } from 'mongoose';

// Define the shape of the AST (Abstract Syntax Tree)
interface AST {
  conditions: any[];
  event: Record<string, any>;
}

// Interface representing a document in MongoDB for a rule
export interface IRule extends Document {
  ruleString: string;
  ast: AST;
}

// Define the Mongoose Schema for the rule
const ruleSchema: Schema<IRule> = new Schema({
  ruleString: {
    type: String,
    required: [true, 'Rule string is required'],
    trim: true,
    minlength: [5, 'Rule string must be at least 5 characters long'],
  },
  ast: {
    type: Object,
    required: [true, 'AST is required'],
    validate: {
      validator: function (value: AST): boolean {

        console.log(`Validating AST: ${JSON.stringify(value)}`);
        return value && value.conditions && typeof value.event === 'object' && value.event !== null;
      },
      message: 'AST must contain valid "conditions" array and "event" object',
    },
  },
});

// Export the Mongoose model for the rule
const Rules = model<IRule>('Rule', ruleSchema);
export default Rules;
