import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { logger } from '../services/logger';

interface AuthRequest extends Request {
  user?: IUser;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }
  next();
};

export const businessMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isBusiness && !req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Business account required.' });
  }
  next();
};

export { AuthRequest };
