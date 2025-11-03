import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { AuthRequest } from '../middlewares/auth';
import { registerSchema, loginSchema, updateUserSchema } from '../validations/user.validation';
import { logger } from '../services/logger';

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      _id: user._id, 
      isAdmin: user.isAdmin, 
      isBusiness: user.isBusiness 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );
};

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const { firstName, lastName, email, password, phone, isBusiness } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      isBusiness: isBusiness || false
    });

    await user.save();
    
    const token = generateToken(user);
    
    logger.info(`User registered: ${email}`);
    
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const { email, password } = req.body;

    // Find user by email and explicitly include password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Get user with password using separate query to ensure password is included
    const userWithPassword = await User.findById(user._id).select('+password');
    if (!userWithPassword || !userWithPassword.password) {
      logger.error('User found but no password available');
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Direct bcrypt comparison
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    
    if (!isMatch) {
      logger.info(`Failed login attempt for: ${email}`);
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user);
    
    logger.info(`User logged in: ${email}`);
    
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error: any) {
    logger.error('Login error:', error.message || error);
    res.status(500).json({ 
      message: 'Server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    res.json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const userId = req.user?._id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`User deleted: ${user.email}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
