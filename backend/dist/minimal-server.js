"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '10000', 10);
// Middleware minimal
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Route de test simple
app.get('/', (req, res) => {
    res.json({
        message: 'Cardify API is running',
        status: 'OK',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});
// Démarrage du serveur
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        // eslint-disable-next-line no-console
        console.log(`🚀 Minimal server running on port ${PORT}`);
    });
}
exports.default = app;
