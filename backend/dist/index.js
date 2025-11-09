"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const logger_1 = require("./services/logger");
const PORT = parseInt(process.env.PORT || '10000', 10);
if (process.env.NODE_ENV !== 'test') {
    server_1.default.listen(PORT, '0.0.0.0', () => {
        logger_1.logger.info(`🚀 Cardify API Server running on port ${PORT}`);
        logger_1.logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger_1.logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
}
exports.default = server_1.default;
