import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  phone: string;
  email: string;
  web?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  address?: {
    state?: string;
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    zip?: string;
  };
  bizNumber: number;
  likes: string[]; // Array of user IDs who liked this card
  user_id: string; // Reference to the user who created the card
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
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
    required: [true, 'Phone is required'],
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  web: {
    type: String,
    validate: {
      validator: function(v: string): boolean {
        if (!v || v === '') return true; // Allow empty strings
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  image: {
    url: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png'
    },
    alt: {
      type: String,
      default: 'Business card image'
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
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate unique bizNumber before saving
CardSchema.pre('save', async function(next): Promise<void> {
  if (this.bizNumber) return next(); // Skip if bizNumber already exists
  
  try {
    let bizNumber: number;
    let isUnique = false;
    
    while (!isUnique) {
      bizNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
      const CardModel = this.constructor as mongoose.Model<ICard>;
      const existingCard = await CardModel.findOne({ bizNumber });
      if (!existingCard) {
        isUnique = true;
        this.bizNumber = bizNumber;
      }
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.model<ICard>('Card', CardSchema);
