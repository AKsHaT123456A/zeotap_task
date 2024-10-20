import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { logError, logInfo } from './utils/logger.util.ts'; // Import the logger and specific logging functions
import { config } from './utils/config.util.ts'; // Import the config

const app = express();

// Middleware: Secure HTTP headers with Helmet
app.use(helmet());

// Middleware: Enable CORS
app.use(
  cors({
    origin: config.clientOrigin, // Use the configured client origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  })
);

// Middleware: Parse JSON requests
app.use(express.json());

// Sample route
app.get('/', (_req: Request, res: Response) => {
  logInfo('GET request to /'); // Log the request
  res.status(200).send('Rule Engine API');
});

// MongoDB connection with improved error handling
mongoose
  .connect(config.mongoUri)
  .then(() => {
    logInfo('Connected to MongoDB'); // Log successful connection
  })
  .catch((err) => {
    logError(`MongoDB connection error: ${err}`); // Log connection error
    process.exit(1); // Exit the process if the connection fails
  });

// Global error handler for catching unhandled errors
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logError(`Global error handler:${err}`); // Log error
  res.status(500).json({
    message: 'Internal Server Error',
    error: config.isDevelopment ? err.message : 'Something went wrong!', // Show detailed error in development
  });
});

// Start the server
app.listen(config.port, () => {
  logInfo(`Server running on port ${config.port}`); // Log server start
});
