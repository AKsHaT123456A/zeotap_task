import winston from 'winston';
import { config } from './config.util.ts';
// Determine if in development mode
const isDevelopment = config.isDevelopment;

// Create a logger instance
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info', // Dynamic log level based on environment
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp
    winston.format.json() // Format logs as JSON
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log initialization message
logger.info('Logger initialized.');

// Export logger instance
export default logger;

// Helper functions for different log levels
export const logInfo = (message: string) => logger.info(message);
export const logError = (message: string) => logger.error(message);
export const logWarn = (message: string) => logger.warn(message);
export const logDebug = (message: string) => logger.debug(message);
export const logHttp = (message: string) => logger.http(message);
export const logVerbose = (message: string) => logger.verbose(message);
export const logSilly = (message: string) => logger.silly(message);
