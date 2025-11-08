"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessMiddleware = exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = require("../services/logger");
// Middleware principal : vérification du token JWT
const authMiddleware = async (req, res, next) => {
    try {
        // Extraction du token depuis l'en-tête Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
        }
        // Vérification et décodage du JWT
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.default.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Token invalide.' });
        }
        // Injection des données utilisateur dans la requête
        req.user = {
            _id: user._id.toString(),
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            isBusiness: user.isBusiness,
            role: user.isAdmin ? 'admin' : user.isBusiness ? 'business' : 'user'
        };
        next(); // Passe au middleware suivant
    }
    catch (error) {
        logger_1.logger.error('Erreur middleware auth:', { error: String(error) });
        return res.status(401).json({ message: 'Token invalide.' });
    }
};
exports.authMiddleware = authMiddleware;
// Middleware admin : vérifie les droits administrateur
const adminMiddleware = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Accès refusé. Droits admin requis.' });
    }
    next(); // Utilisateur admin confirmé
};
exports.adminMiddleware = adminMiddleware;
// Middleware business : vérifie le compte professionnel
const businessMiddleware = (req, res, next) => {
    if (!req.user?.isBusiness && !req.user?.isAdmin) {
        return res.status(403).json({ message: 'Accès refusé. Compte business requis.' });
    }
    next(); // Compte business ou admin confirmé
};
exports.businessMiddleware = businessMiddleware;
