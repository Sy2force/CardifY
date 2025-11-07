import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): Response | void => {
  const error = { message: err.message, stack: err.stack, statusCode: 500 };
  let statusCode = 500;

  // Log error
  logger.error(`${req.method} ${req.path}`, {
    error: err.message,
    stack: err.stack,
    statusCode: (err as Error & { statusCode?: number }).statusCode
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.name === 'MongoServerError' && (err as Error & { code?: number }).code === 11000) {
    error.message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as Error & { errors?: Record<string, { message: string }> }).errors || {}).map((val) => val.message);
    error.message = message.join(', ');
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
