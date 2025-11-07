import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { logger } from '../services/logger';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  isAdmin: boolean;
  isBusiness: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    match: [/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBusiness: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  try {
    if (!this.password) {
      throw new Error('No password found for user');
    }
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    logger.error('Password comparison error', { error: String(error) });
    throw error;
  }
};

// Remove password from JSON output
UserSchema.methods.toJSON = function(): Record<string, unknown> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<IUser>('User', UserSchema);
