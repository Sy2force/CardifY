"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validate = void 0;
const logger_1 = require("../services/logger");
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            logger_1.logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).json({
                message: 'Validation error',
                details: error.details[0].message
            });
        }
        next();
    };
};
exports.validate = validate;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            logger_1.logger.warn(`Query validation error: ${error.details[0].message}`);
            return res.status(400).json({
                message: 'Query validation error',
                details: error.details[0].message
            });
        }
        next();
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            logger_1.logger.warn(`Params validation error: ${error.details[0].message}`);
            return res.status(400).json({
                message: 'Params validation error',
                details: error.details[0].message
            });
        }
        next();
    };
};
exports.validateParams = validateParams;
