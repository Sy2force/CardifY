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
// Génération d'un token JWT sécurisé
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        isAdmin: user.isAdmin,
        isBusiness: user.isBusiness
    }, process.env.JWT_SECRET, { expiresIn: '30d' } // Token valide 30 jours
    );
};
// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
    try {
        // Validation des données d'entrée
        const { error } = user_validation_1.registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const { firstName, lastName, email, password, phone, isBusiness, isAdmin } = req.body;
        // Vérification : email déjà utilisé ?
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }
        // Création du nouvel utilisateur
        const user = new user_model_1.default({
            firstName,
            lastName,
            email,
            password, // Sera hashé automatiquement par le middleware
            phone,
            isBusiness: isBusiness || false,
            isAdmin: isAdmin || false
        });
        await user.save(); // Sauvegarde en DB
        const token = generateToken(user); // Génération du JWT
        logger_1.logger.info(`Nouvel utilisateur inscrit: ${user.email}`);
        res.status(201).json({
            success: true,
            message: 'Inscription réussie',
            user: user.toJSON(), // Sans le mot de passe
            token
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur inscription:', { error: String(error) });
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.register = register;
// Connexion utilisateur
const login = async (req, res) => {
    try {
        // Validation des données
        const { error } = user_validation_1.loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const { email, password } = req.body;
        // Recherche de l'utilisateur par email
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        // Récupération avec mot de passe (exclu par défaut)
        const userWithPassword = await user_model_1.default.findById(user._id).select('+password');
        if (!userWithPassword || !userWithPassword.password) {
            logger_1.logger.error('Utilisateur trouvé mais mot de passe manquant');
            return res.status(400).json({
                message: 'Email ou mot de passe incorrect'
            });
        }
        // Vérification sécurisée du mot de passe
        const isMatch = await bcryptjs_1.default.compare(password, userWithPassword.password);
        if (!isMatch) {
            logger_1.logger.info(`Tentative de connexion échouée: ${email}`);
            return res.status(400).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        const token = generateToken(user); // Génération du JWT
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
// Récupération du profil utilisateur connecté
const getProfile = async (req, res) => {
    try {
        const user = req.user; // Injecté par le middleware auth
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
// Mise à jour du profil utilisateur
const updateProfile = async (req, res) => {
    try {
        // Validation des nouvelles données
        const { error } = user_validation_1.updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const userId = req.user?._id;
        const updates = req.body;
        // Mise à jour avec validation
        const user = await user_model_1.default.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true } // Retourne le doc mis à jour + validation
        );
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
// Liste de tous les utilisateurs (admin uniquement)
const getAllUsers = async (req, res) => {
    try {
        // Paramètres de pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Récupération avec pagination
        const users = await user_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Plus récents en premier
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
// Suppression d'un utilisateur (admin uniquement)
const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        // Suppression de l'utilisateur
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
