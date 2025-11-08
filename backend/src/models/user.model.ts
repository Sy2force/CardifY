// Modèle utilisateur - Structure et validation des comptes
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { logger } from '../services/logger';

// Interface TypeScript pour un utilisateur
export interface IUser extends Document {
  _id: string;
  firstName: string;     // Prénom
  lastName: string;      // Nom de famille
  email: string;         // Email (unique)
  password: string;      // Mot de passe hashé
  phone?: string;        // Téléphone (optionnel)
  isAdmin: boolean;      // Rôle administrateur
  isBusiness: boolean;   // Compte business
  createdAt: Date;       // Date création
  updatedAt: Date;       // Date modification
  comparePassword(password: string): Promise<boolean>; // Vérification MDP
}

// Schéma MongoDB avec validations
const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    minlength: 2,    // Min 2 caractères
    maxlength: 50,   // Max 50 caractères
    trim: true       // Supprime espaces début/fin
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,     // Index unique en DB
    lowercase: true,  // Conversion auto en minuscules
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Format email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6     // Minimum 6 caractères
  },
  phone: {
    type: String,
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Format téléphone invalide'] // Format international
  },
  isAdmin: {
    type: Boolean,
    default: false   // Utilisateur normal par défaut
  },
  isBusiness: {
    type: Boolean,
    default: false   // Compte personnel par défaut
  }
}, {
  timestamps: true   // Ajoute createdAt et updatedAt automatiquement
});

// Middleware : hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function(next) {
  // Skip si le mot de passe n'a pas changé
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);              // Génération du sel
    this.password = await bcrypt.hash(this.password, salt); // Hash avec bcrypt
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Méthode : comparaison sécurisée des mots de passe
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  try {
    if (!this.password) {
      throw new Error('Aucun mot de passe trouvé pour cet utilisateur');
    }
    // Comparaison avec bcrypt (résistant aux attaques timing)
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    logger.error('Erreur comparaison mot de passe', { error: String(error) });
    throw error;
  }
};

// Méthode : supprime le mot de passe des réponses JSON
UserSchema.methods.toJSON = function(): Record<string, unknown> {
  const userObject = this.toObject();
  delete userObject.password; // Sécurité : jamais exposer le hash
  return userObject;
};

// Export du modèle Mongoose
export default mongoose.model<IUser>('User', UserSchema);
