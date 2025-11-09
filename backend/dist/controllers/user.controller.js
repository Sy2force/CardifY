"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.getAllUsers = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const user_validation_1 = require("../validations/user.validation");
const logger_1 = require("../services/logger");
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        isAdmin: user.isAdmin,
        isBusiness: user.isBusiness
    }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const register = async (req, res) => {
    try {
        const { error } = user_validation_1.registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details?.[0]?.message || 'Validation error'
            });
        }
        const { firstName, lastName, email, password, phone, isBusiness, isAdmin } = req.body;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }
        const user = new user_model_1.default({
            firstName,
            lastName,
            email,
            password,
            phone,
            isBusiness: isBusiness || false,
            isAdmin: isAdmin || false
        });
        await user.save();
        const token = generateToken(user);
        logger_1.logger.info(`Nouvel utilisateur inscrit: ${user.email}`);
        res.status(201).json({
            success: true,
            message: 'Inscription réussie',
            user: user.toJSON(),
            token
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur inscription:', { error: String(error) });
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { error } = user_validation_1.loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details?.[0]?.message || 'Validation error'
            });
        }
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        const userWithPassword = await user_model_1.default.findById(user._id).select('+password');
        if (!userWithPassword || !userWithPassword.password) {
            logger_1.logger.error('Utilisateur trouvé mais mot de passe manquant');
            return res.status(400).json({
                message: 'Email ou mot de passe incorrect'
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, userWithPassword.password);
        if (!isMatch) {
            logger_1.logger.info(`Tentative de connexion échouée: ${email}`);
            return res.status(400).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        const token = generateToken(user);
        logger_1.logger.info(`Connexion réussie: ${user.email}`);
        res.json({
            success: true,
            message: 'Connexion réussie',
            user: user.toJSON(),
            token
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        logger_1.logger.error('Erreur connexion:', { error: String(error) });
        res.status(500).json({
            message: 'Erreur serveur',
            ...(process.env.NODE_ENV === 'development' && { error: errorMessage })
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }
        res.json({
            success: true,
            message: 'Profil récupéré avec succès',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                isBusiness: user.isBusiness,
                role: user.role
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur récupération profil:', { error: String(error) });
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { error } = user_validation_1.updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details?.[0]?.message || 'Validation error'
            });
        }
        const userId = req.user?._id;
        const updates = req.body;
        const user = await user_model_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        logger_1.logger.info(`Profil mis à jour: ${user.email}`);
        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            user: user.toJSON()
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur mise à jour profil:', { error: String(error) });
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.updateProfile = updateProfile;
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await user_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await user_model_1.default.countDocuments();
        res.json({
            message: 'Utilisateurs récupérés avec succès',
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur récupération utilisateurs:', { error: String(error) });
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.getAllUsers = getAllUsers;
const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await user_model_1.default.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        logger_1.logger.info(`Utilisateur supprimé: ${user.email}`);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    }
    catch (error) {
        logger_1.logger.error('Erreur suppression utilisateur:', { error: String(error) });
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.deleteProfile = deleteProfile;
