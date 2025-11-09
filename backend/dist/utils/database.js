"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDB = exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../services/logger");
const connectDB = async () => {
    try {
        // Check if already connected to avoid multiple connections
        if (mongoose_1.default.connection.readyState === 1) {
            if (process.env.NODE_ENV !== 'test') {
                logger_1.logger.info('✅ MongoDB already connected');
            }
            return;
        }
        const mongoUri = process.env.NODE_ENV === 'test'
            ? process.env.MONGO_URI_TEST
            : process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error(`MONGO_URI${process.env.NODE_ENV === 'test' ? '_TEST' : ''} environment variable is required`);
        }
        await mongoose_1.default.connect(mongoUri);
        if (process.env.NODE_ENV !== 'test') {
            logger_1.logger.info('✅ MongoDB connected');
        }
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB connection error', { error: String(error) });
        // Don't exit process in test environment to avoid crashing Jest
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
        else {
            throw error; // Re-throw error in test environment
        }
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        if (process.env.NODE_ENV !== 'test') {
            logger_1.logger.info('📴 MongoDB disconnected');
        }
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB disconnection error', { error: String(error) });
    }
};
exports.disconnectDB = disconnectDB;
const clearDB = async () => {
    try {
        const collections = mongoose_1.default.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection?.deleteMany({});
        }
    }
    catch (error) {
        logger_1.logger.error('❌ Error clearing database', { error: String(error) });
    }
};
exports.clearDB = clearDB;
