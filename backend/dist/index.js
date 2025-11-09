"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
if (!process.env.MONGO_URI) {
    throw new Error('❌ Missing MONGO_URI environment variable');
}
if (!process.env.JWT_SECRET) {
    throw new Error('❌ Missing JWT_SECRET environment variable');
}
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '10000', 10);
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL || 'https://cardify-app-new.vercel.app', 'https://cardify-app-new.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3008'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Cardify API is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
        port: PORT
    });
});
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Cardify API is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
        port: PORT
    });
});
app.get('/', (_req, res) => {
    res.json({
        message: 'Welcome to Cardify API',
        version: '1.0.0',
        status: 'active'
    });
});
app.use('*', (_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            retryWrites: true,
            authSource: 'admin'
        });
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        if (process.env.NODE_ENV === 'production') {
            console.log('🔄 Retrying MongoDB connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        }
        else {
            process.exit(1);
        }
    }
};
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Cardify API Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
    });
    connectDB();
}
exports.default = app;
