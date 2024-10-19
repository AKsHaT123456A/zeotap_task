import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

// Export configuration values
export const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/rule-engine-db',
  port: parseInt(process.env.PORT || '3000', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  isDevelopment: process.env.NODE_ENV === 'development', // Check if in development mode
};
