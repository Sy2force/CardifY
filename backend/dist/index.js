"use strict";
/**
 * Entry point for Cardify Backend API
 * Minimal Express + MongoDB + TypeScript setup for Render deployment
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
