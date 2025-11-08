"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Modèle carte professionnelle - Structure et validation des cartes
const mongoose_1 = __importStar(require("mongoose"));
// Schéma MongoDB avec validations complètes
const CardSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        minlength: 2, // Min 2 caractères
        maxlength: 100, // Max 100 caractères
        trim: true // Supprime espaces début/fin
    },
    subtitle: {
        type: String,
        minlength: 2,
        maxlength: 100,
        trim: true // Profession/Poste
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
            validator: function (v) {
                if (!v || v === '')
                    return true; // Autorise les chaînes vides
                return /^https?:\/\/.+/.test(v); // Doit commencer par http(s)://
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
    address: {
        state: {
            type: String,
            maxlength: 50 // État/Région
        },
        country: {
            type: String,
            minlength: 2,
            maxlength: 50 // Pays
        },
        city: {
            type: String,
            minlength: 2,
            maxlength: 50 // Ville
        },
        street: {
            type: String,
            minlength: 2,
            maxlength: 100 // Rue
        },
        houseNumber: {
            type: String,
            minlength: 1,
            maxlength: 20 // Numéro de rue
        },
        zip: {
            type: String,
            maxlength: 10 // Code postal
        }
    },
    bizNumber: {
        type: Number,
        unique: true, // Index unique en DB
        min: 1000000, // 7 chiffres minimum
        max: 9999999 // 7 chiffres maximum
    },
    likes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User' // Référence vers User
        }],
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Obligatoire
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});
// Middleware : génération automatique d'un numéro business unique
CardSchema.pre('save', async function (next) {
    if (this.bizNumber)
        return next(); // Skip si déjà défini
    try {
        let bizNumber;
        let isUnique = false;
        // Boucle jusqu'à trouver un numéro unique
        while (!isUnique) {
            bizNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000; // 7 chiffres aléatoires
            const CardModel = this.constructor;
            const existingCard = await CardModel.findOne({ bizNumber });
            if (!existingCard) {
                isUnique = true;
                this.bizNumber = bizNumber; // Attribution du numéro unique
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
// Export du modèle Mongoose
exports.default = mongoose_1.default.model('Card', CardSchema);
