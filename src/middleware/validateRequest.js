"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
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
exports.validateRequest = validateRequest;
