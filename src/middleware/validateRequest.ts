import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    // Validate request body against the schema
    const { error } = schema.validate(req.body);

    // If validation fails, return an error response
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // If validation passes, call next() to move to the next middleware
    next();
  };
};
