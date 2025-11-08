"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_js_1 = require("./services/logger.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 10000;
// CORS simple
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use(express_1.default.json());
// Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Cardify API is running',
        timestamp: new Date().toISOString()
    });
});
// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Démarrage serveur
if (process.env.NODE_ENV !== 'test') {
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
        mongoose_1.default.connect(mongoUri)
            .then(() => logger_js_1.logger.info('MongoDB connected'))
            .catch(() => logger_js_1.logger.warn('MongoDB connection failed, continuing without DB'));
    }
    app.listen(PORT, () => {
        logger_js_1.logger.info(`Server running on port ${PORT}`);
    });
}
exports.default = app;
