import { Schema, Document, model } from 'mongoose';
import { Node } from '../utils/type.util';



// Interface representing a document in MongoDB for a rule
export interface IRule extends Document {
  ruleString: string;
  ast: Node;  // AST structure to represent the rule
}

// Define the schema for a Node (to represent the AST)
const nodeSchema: Schema<Node> = new Schema({
  type: {
    type: String,
    required: [true, 'Node type is required'],
    enum: ['operator', 'operand'],
  },
  left: {
    type: Schema.Types.Mixed, // Allows referencing another node (for operators)
    default: null,
  },
  right: {
    type: Schema.Types.Mixed, // Allows referencing another node (for operators)
    default: null,
  },
  value: {
    type: Schema.Types.Mixed, // Stores value (for operands)
    default: null,
  },
}, { _id: false });  // No automatic _id for subdocuments

// Define the Mongoose Schema for the rule
const ruleSchema: Schema<IRule> = new Schema({
  ruleString: {
    type: String,
    required: [true, 'Rule string is required'],
    trim: true,
    minlength: [5, 'Rule string must be at least 5 characters long'],
  },
  ast: {
    type: nodeSchema,  // Embed the Node schema for AST
    required: [true, 'AST is required'],
    validate: {
      validator: function (value: Node): boolean {
        console.log(`Validating AST: ${JSON.stringify(value)}`);
        return validateAST(value);
      },
      message: 'Invalid AST structure',
    },
  },
});

// Helper function to validate AST structure
const validateAST = (node: Node): boolean => {
  if (!node || !node.type) return false;
  
  if (node.type === 'operand') {
    // Ensure the value is present for operands
    return !!node.value;
  }
  
  if (node.type === 'operator') {
    // Ensure both left and right children are valid nodes for operators
    return node.left !== undefined && node.right !== undefined && validateAST(node.left!) && validateAST(node.right!);
  }
  
  return false;
};

// Export the Mongoose model for the rule
const Rule = model<IRule>('Rule', ruleSchema);
export default Rule;
