import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { logger } from '../services/logger';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }
    
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      logger.warn(`Query validation error: ${error.details[0].message}`);
      return res.status(400).json({
        message: 'Query validation error',
        details: error.details[0].message
      });
    }
    
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      logger.warn(`Params validation error: ${error.details[0].message}`);
      return res.status(400).json({
        message: 'Params validation error',
        details: error.details[0].message
      });
    }
    
    next();
  };
};
