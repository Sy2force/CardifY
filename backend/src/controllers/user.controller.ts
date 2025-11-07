// Contrôleur utilisateurs - Gestion auth et profils
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { AuthRequest } from '../types/AuthRequest';
import { registerSchema, loginSchema, updateUserSchema } from '../validations/user.validation';
import { logger } from '../services/logger';
// import { sendEmail } from '../services/email'; // Service email (futur)

// Interface pour les données du token JWT
interface TokenUser {
  _id: string;
  isAdmin: boolean;
  isBusiness: boolean;
}

// Génération d'un token JWT sécurisé
const generateToken = (user: TokenUser): string => {
  return jwt.sign(
    { 
      _id: user._id, 
      isAdmin: user.isAdmin, 
      isBusiness: user.isBusiness 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' } // Token valide 30 jours
  );
};

// Inscription d'un nouvel utilisateur
export const register = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    // Validation des données d'entrée
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const { firstName, lastName, email, password, phone, isBusiness, isAdmin } = req.body;

    // Vérification : email déjà utilisé ?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Création du nouvel utilisateur
    const user = new User({
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

    logger.info(`Nouvel utilisateur inscrit: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      user: user.toJSON(), // Sans le mot de passe
      token
    });
  } catch (error) {
    logger.error('Erreur inscription:', { error: String(error) });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Connexion utilisateur
export const login = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    // Validation des données
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const { email, password } = req.body;

    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Récupération avec mot de passe (exclu par défaut)
    const userWithPassword = await User.findById(user._id).select('+password');
    if (!userWithPassword || !userWithPassword.password) {
      logger.error('Utilisateur trouvé mais mot de passe manquant');
      return res.status(400).json({ 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Vérification sécurisée du mot de passe
    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    
    if (!isMatch) {
      logger.info(`Tentative de connexion échouée: ${email}`);
      return res.status(400).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    const token = generateToken(user); // Génération du JWT
    
    logger.info(`Connexion réussie: ${user.email}`);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: user.toJSON(),
      token
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    logger.error('Erreur connexion:', { error: String(error) });
    res.status(500).json({ 
      message: 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { error: errorMessage })
    });
  }
};

// Récupération du profil utilisateur connecté
export const getProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
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
  } catch (error) {
    logger.error('Erreur récupération profil:', { error: String(error) });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mise à jour du profil utilisateur
export const updateProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    // Validation des nouvelles données
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const userId = req.user?._id;
    const updates = req.body;

    // Mise à jour avec validation
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true } // Retourne le doc mis à jour + validation
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    logger.info(`Profil mis à jour: ${user.email}`);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: user.toJSON()
    });
  } catch (error) {
    logger.error('Erreur mise à jour profil:', { error: String(error) });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Liste de tous les utilisateurs (admin uniquement)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    // Paramètres de pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Récupération avec pagination
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Plus récents en premier

    const total = await User.countDocuments();

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
  } catch (error) {
    logger.error('Erreur récupération utilisateurs:', { error: String(error) });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Suppression d'un utilisateur (admin uniquement)
export const deleteProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const userId = req.params.id;
    
    // Suppression de l'utilisateur
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    logger.info(`Utilisateur supprimé: ${user.email}`);

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    logger.error('Erreur suppression utilisateur:', { error: String(error) });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
