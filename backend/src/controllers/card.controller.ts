import { Response } from 'express';
import Card, { ICard } from '../models/card.model';
import { AuthRequest } from '../types/AuthRequest';
import { createCardSchema, updateCardSchema } from '../validations/card.validation';
import { logger } from '../services/logger';

export const createCard = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = createCardSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const cardData = {
      ...req.body,
      user_id: req.user?._id
    };

    const card = new Card(cardData);
    await card.save();

    logger.info(`Card created: ${card.title} by user ${req.user?.email}`);

    res.status(201).json({
      message: 'Card created successfully',
      card
    });
  } catch (error) {
    logger.error('Create card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCards = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const cards = await Card.find()
      .populate('user_id', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Card.countDocuments();

    res.json({
      message: 'Cards retrieved successfully',
      cards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get all cards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyCards = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const userId = req.user?._id;

    const cards = await Card.find({ user_id: userId })
      .populate('user_id', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log('User ID:', userId, 'Card User ID:', cards[0]?.user_id, 'Is Admin:', req.user?.isAdmin);

    const total = await Card.countDocuments({ user_id: userId });

    res.json({
      message: 'My cards retrieved successfully',
      cards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get my cards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCardById = async (req: AuthRequest, res: Response) => {
  try {
    const cardId = req.params.id;

    const card = await Card.findById(cardId)
      .populate('user_id', 'firstName lastName email');

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({
      message: 'Card retrieved successfully',
      card
    });
  } catch (error) {
    logger.error('Get card by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCard = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = updateCardSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const cardId = req.params.id;
    const userId = req.user?._id;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check if user owns the card or is admin
    if (card.user_id.toString() !== userId?.toString() && !req.user?.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own cards.' 
      });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user_id', 'firstName lastName');

    logger.info(`Card updated: ${updatedCard?.title} by user ${req.user?.email}`);

    res.json({
      message: 'Card updated successfully',
      card: updatedCard
    });
  } catch (error) {
    logger.error('Update card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCard = async (req: AuthRequest, res: Response) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?._id;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check if user owns the card or is admin
    if (card.user_id.toString() !== userId?.toString() && !req.user?.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. You can only delete your own cards.' 
      });
    }

    await Card.findByIdAndDelete(cardId);

    logger.info(`Card deleted: ${card.title} by user ${req.user?.email}`);

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    logger.error('Delete card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const likeCard = async (req: AuthRequest, res: Response) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?._id;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const isLiked = card.likes.includes(userId as any);
    
    if (isLiked) {
      // Unlike the card
      card.likes = card.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the card
      card.likes.push(userId as any);
    }

    await card.save();

    logger.info(`Card ${isLiked ? 'unliked' : 'liked'}: ${card.title} by user ${req.user?.email}`);

    res.json({
      message: `Card ${isLiked ? 'unliked' : 'liked'} successfully`,
      card,
      isLiked: !isLiked
    });
  } catch (error) {
    logger.error('Like card error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
