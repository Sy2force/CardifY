"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../services/logger");
const errorHandler = (err, req, res, _next) => {
    const error = { message: err.message, stack: err.stack, statusCode: 500 };
    let statusCode = 500;
    // Log error
    logger_1.logger.error(`${req.method} ${req.path}`, {
        error: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        statusCode = 404;
    }
    // Mongoose duplicate key
    if (err.name === 'MongoServerError' && err.code === 11000) {
        error.message = 'Duplicate field value entered';
        statusCode = 400;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors || {}).map((val) => val.message);
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
exports.errorHandler = errorHandler;
