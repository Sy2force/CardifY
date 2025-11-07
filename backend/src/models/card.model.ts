// Modèle carte professionnelle - Structure et validation des cartes
import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript pour une carte professionnelle
export interface ICard extends Document {
  _id: string;
  title: string;        // Nom/Titre principal
  subtitle?: string;    // Sous-titre/Profession
  description?: string; // Description détaillée
  phone: string;        // Téléphone (requis)
  email: string;        // Email (requis)
  web?: string;         // Site web (optionnel)
  image?: {             // Image de la carte
    url?: string;
    alt?: string;
  };
  address?: {           // Adresse complète
    state?: string;
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    zip?: string;
  };
  bizNumber: number;    // Numéro business unique
  likes: string[];      // IDs des utilisateurs qui ont liké
  user_id: string;      // Référence vers le créateur
  createdAt: Date;      // Date création
  updatedAt: Date;      // Date modification
}

// Schéma MongoDB avec validations complètes
const CardSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    minlength: 2,    // Min 2 caractères
    maxlength: 100,  // Max 100 caractères
    trim: true       // Supprime espaces début/fin
  },
  subtitle: {
    type: String,
    minlength: 2,
    maxlength: 100,
    trim: true       // Profession/Poste
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 1000, // Description longue autorisée
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Format téléphone invalide'] // Format international
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    lowercase: true, // Conversion auto en minuscules
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Format email invalide']
  },
  web: {
    type: String,
    validate: {
      validator: function(v: string): boolean {
        if (!v || v === '') return true; // Autorise les chaînes vides
        return /^https?:\/\/.+/.test(v);  // Doit commencer par http(s)://
      },
      message: 'URL invalide (doit commencer par http:// ou https://)'
    }
  },
  image: {
    url: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png' // Image par défaut
    },
    alt: {
      type: String,
      default: 'Image de carte professionnelle'
    }
  },
  address: {              // Adresse complète optionnelle
    state: {
      type: String,
      maxlength: 50       // État/Région
    },
    country: {
      type: String,
      minlength: 2,
      maxlength: 50       // Pays
    },
    city: {
      type: String,
      minlength: 2,
      maxlength: 50       // Ville
    },
    street: {
      type: String,
      minlength: 2,
      maxlength: 100      // Rue
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 20       // Numéro de rue
    },
    zip: {
      type: String,
      maxlength: 10       // Code postal
    }
  },
  bizNumber: {
    type: Number,
    unique: true,         // Index unique en DB
    min: 1000000,         // 7 chiffres minimum
    max: 9999999          // 7 chiffres maximum
  },
  likes: [{               // Tableau des likes
    type: Schema.Types.ObjectId,
    ref: 'User'           // Référence vers User
  }],
  user_id: {              // Propriétaire de la carte
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true        // Obligatoire
  }
}, {
  timestamps: true        // Ajoute createdAt et updatedAt
});

// Middleware : génération automatique d'un numéro business unique
CardSchema.pre('save', async function(next): Promise<void> {
  if (this.bizNumber) return next(); // Skip si déjà défini
  
  try {
    let bizNumber: number;
    let isUnique = false;
    
    // Boucle jusqu'à trouver un numéro unique
    while (!isUnique) {
      bizNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000; // 7 chiffres aléatoires
      const CardModel = this.constructor as mongoose.Model<ICard>;
      const existingCard = await CardModel.findOne({ bizNumber });
      if (!existingCard) {
        isUnique = true;
        this.bizNumber = bizNumber; // Attribution du numéro unique
      }
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Export du modèle Mongoose
export default mongoose.model<ICard>('Card', CardSchema);
