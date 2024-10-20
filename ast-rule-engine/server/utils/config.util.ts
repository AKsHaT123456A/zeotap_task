import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

// Export configuration values
export const config = {
  mongoUri:'mongodb://localhost:27017/ast-engine3rd-tier',
  port: parseInt(process.env.PORT || '3000', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  isDevelopment: process.env.NODE_ENV === 'development', // Check if in development mode
};
