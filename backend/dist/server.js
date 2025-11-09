"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const error_1 = require("./middlewares/error");
const rateLimit_1 = require("./middlewares/rateLimit");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const card_routes_1 = __importDefault(require("./routes/card.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const logger_1 = require("./services/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL || 'https://cardify-app-new.vercel.app', 'https://cardify-app-new.vercel.app', 'https://www.cardify-app-new.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3008'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(rateLimit_1.generalLimiter);
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsDir));
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Cardify API is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});
app.use('/api/users', user_routes_1.default);
app.use('/api/cards', card_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use(error_1.errorHandler);
app.use('*', (_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const connectWithRetry = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        logger_1.logger.error('MONGO_URI environment variable is not set');
        logger_1.logger.info('Available environment variables:', {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            hasJWT: !!process.env.JWT_SECRET,
            hasMONGO: !!process.env.MONGO_URI
        });
        process.exit(1);
    }
    const sanitizedUri = mongoUri.replace(/\/\/.*@/, '//***@');
    logger_1.logger.info(`Attempting MongoDB connection to: ${sanitizedUri}`);
    const options = {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        retryWrites: true,
        authSource: 'admin'
    };
    try {
        await mongoose_1.default.connect(mongoUri, options);
        logger_1.logger.info('✅ MongoDB connected successfully');
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB connection failed:', { error: error instanceof Error ? error.message : String(error) });
        if (process.env.NODE_ENV === 'production') {
            logger_1.logger.info('Retrying MongoDB connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        }
        else {
            process.exit(1);
        }
    }
};
if (process.env.NODE_ENV !== 'test') {
    connectWithRetry();
}
exports.default = app;
