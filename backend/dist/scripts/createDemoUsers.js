"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDemoUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = require("../services/logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEMO_USERS = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@cardify.com',
        password: 'admin123',
        phone: '+33123456789',
        isAdmin: true,
        isBusiness: true
    },
    {
        firstName: 'Sarah',
        lastName: 'Cohen',
        email: 'sarah@example.com',
        password: 'business123',
        phone: '+33987654321',
        isAdmin: false,
        isBusiness: true
    },
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'user123',
        phone: '+33555666777',
        isAdmin: false,
        isBusiness: false
    }
];
const validateDemoUserData = (userData) => {
    return (typeof userData === 'object' &&
        userData !== null &&
        typeof userData.firstName === 'string' &&
        typeof userData.lastName === 'string' &&
        typeof userData.email === 'string' &&
        typeof userData.password === 'string' &&
        typeof userData.phone === 'string' &&
        typeof userData.isAdmin === 'boolean' &&
        typeof userData.isBusiness === 'boolean' &&
        userData.email.includes('@') &&
        userData.firstName.length > 0 &&
        userData.lastName.length > 0 &&
        userData.password.length >= 6);
};
const createDemoUsers = async () => {
    try {
        logger_1.logger.info('🚀 Starting demo users creation process...');
        let createdCount = 0;
        let existingCount = 0;
        for (const userData of DEMO_USERS) {
            try {
                if (!validateDemoUserData(userData)) {
                    const userRecord = userData;
                    logger_1.logger.error(`❌ Invalid user data structure for: ${userRecord.email || 'unknown'}`);
                    continue;
                }
                const existingUser = await user_model_1.default.findOne({ email: userData.email });
                if (!existingUser) {
                    const user = new user_model_1.default(userData);
                    await user.save();
                    createdCount++;
                    const roleLabel = userData.isAdmin ? 'Admin' : userData.isBusiness ? 'Business' : 'User';
                    logger_1.logger.info(`✅ Demo user created: ${userData.email} (${roleLabel})`);
                }
                else {
                    existingCount++;
                    logger_1.logger.info(`ℹ️  Demo user already exists: ${userData.email}`);
                }
            }
            catch (userError) {
                logger_1.logger.error(`❌ Failed to create user ${userData.email}:`, { error: String(userError) });
            }
        }
        logger_1.logger.info(`🎉 Demo users creation completed! Created: ${createdCount}, Existing: ${existingCount}`);
    }
    catch (error) {
        logger_1.logger.error('💥 Error in demo users creation process:', { error: String(error) });
        throw error;
    }
};
exports.createDemoUsers = createDemoUsers;
const runScript = async () => {
    let isConnected = false;
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            logger_1.logger.error('MONGO_URI environment variable is required');
            process.exit(1);
        }
        logger_1.logger.info(`🔌 Connecting to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***@')}`);
        await mongoose_1.default.connect(mongoUri);
        isConnected = true;
        logger_1.logger.info('✅ Connected to MongoDB successfully');
        await (0, exports.createDemoUsers)();
    }
    catch (error) {
        logger_1.logger.error('💥 Script execution failed:', {
            error: String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        process.exit(1);
    }
    finally {
        if (isConnected) {
            try {
                await mongoose_1.default.disconnect();
                logger_1.logger.info('🔌 Disconnected from MongoDB');
            }
            catch (disconnectError) {
                logger_1.logger.error('⚠️  Error disconnecting from MongoDB:', { error: String(disconnectError) });
            }
        }
        logger_1.logger.info('🏁 Script execution completed');
        process.exit(0);
    }
};
if (require.main === module) {
    process.on('SIGINT', async () => {
        logger_1.logger.info('🛑 Received SIGINT, shutting down gracefully...');
        await mongoose_1.default.disconnect();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        logger_1.logger.info('🛑 Received SIGTERM, shutting down gracefully...');
        await mongoose_1.default.disconnect();
        process.exit(0);
    });
    runScript();
}
