// Authentication middlewares - Token verification and permissions
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { logger } from '../services/logger';

// Extended Request interface with user property
interface AuthRequest extends Request {
  user?: {
    _id: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isBusiness: boolean;
    role: string;
  };
}

// Middleware principal : vérification du token JWT
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // Extraction du token depuis l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    // Vérification et décodage du JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
    const user = await User.findById(decoded._id);
    
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
  } catch (error: unknown) {
    logger.error('Erreur middleware auth:', { error: String(error) });
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

// Middleware admin : vérifie les droits administrateur
export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Accès refusé. Droits admin requis.' });
  }
  next(); // Utilisateur admin confirmé
};

// Middleware business : vérifie le compte professionnel
export const businessMiddleware = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  if (!req.user?.isBusiness && !req.user?.isAdmin) {
    return res.status(403).json({ message: 'Accès refusé. Compte business requis.' });
  }
  next(); // Compte business ou admin confirmé
};
