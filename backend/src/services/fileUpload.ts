// Service d'upload de fichiers - Gestion des téléchargements d'images avec Multer
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { logger } from './logger';

// Création du répertoire uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration du stockage Multer pour les uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadsDir); // Répertoire de destination
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Génération d'un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour accepter uniquement les images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // Fichier accepté
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés (jpeg, jpg, png, gif, webp)'));
  }
};

// Configuration Multer avec limites et filtres
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: fileFilter,
});

// Service de gestion des fichiers uploadés
export class FileUploadService {
  // Génère l'URL publique d'un fichier
  static getFileUrl(filename: string): string {
    return `${process.env.SERVER_URL || 'http://localhost:3006'}/uploads/${filename}`;
  }

  // Supprime un fichier du système de fichiers
  static deleteFile(filename: string): boolean {
    try {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Fichier supprimé: ${filename}`);
        return true;
      }
      return false; // Fichier inexistant
    } catch (error) {
      logger.error(`Erreur suppression fichier ${filename}:`, { error: String(error) });
      return false;
    }
  }

  // Valide un fichier image selon les critères définis
  static validateImageFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Vérification de la taille du fichier
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'La taille du fichier doit être inférieure à 5MB' };
    }

    // Vérification du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Seuls les fichiers image sont autorisés' };
    }

    return { valid: true }; // Fichier valide
  }
}
