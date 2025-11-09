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
const mongoose_1 = __importStar(require("mongoose"));
const CardSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        minlength: 2,
        maxlength: 100,
        trim: true
    },
    subtitle: {
        type: String,
        minlength: 2,
        maxlength: 100,
        trim: true
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 1000,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Le téléphone est requis'],
        match: [/^[+]?[1-9][\d]{0,15}$/, 'Format téléphone invalide']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Format email invalide']
    },
    web: {
        type: String,
        validate: {
            validator: function (v) {
                if (!v || v === '')
                    return true;
                return /^https?:\/\/.+/.test(v);
            },
            message: 'URL invalide (doit commencer par http:// ou https://)'
        }
    },
    image: {
        url: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png'
        },
        alt: {
            type: String,
            default: 'Image de carte professionnelle'
        }
    },
    address: {
        state: {
            type: String,
            maxlength: 50
        },
        country: {
            type: String,
            minlength: 2,
            maxlength: 50
        },
        city: {
            type: String,
            minlength: 2,
            maxlength: 50
        },
        street: {
            type: String,
            minlength: 2,
            maxlength: 100
        },
        houseNumber: {
            type: String,
            minlength: 1,
            maxlength: 20
        },
        zip: {
            type: String,
            maxlength: 10
        }
    },
    bizNumber: {
        type: Number,
        unique: true,
        min: 1000000,
        max: 9999999
    },
    likes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
CardSchema.pre('save', async function (next) {
    if (this.bizNumber)
        return next();
    try {
        let bizNumber;
        let isUnique = false;
        while (!isUnique) {
            bizNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
            const CardModel = this.constructor;
            const existingCard = await CardModel.findOne({ bizNumber });
            if (!existingCard) {
                isUnique = true;
                this.bizNumber = bizNumber;
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = mongoose_1.default.model('Card', CardSchema);
