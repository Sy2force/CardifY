"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeCard = exports.deleteCard = exports.updateCard = exports.getCardById = exports.getMyCards = exports.getAllCards = exports.createCard = void 0;
const card_model_1 = __importDefault(require("../models/card.model"));
const card_validation_1 = require("../validations/card.validation");
const logger_1 = require("../services/logger");
const createCard = async (req, res) => {
    try {
        if (!req.user?.isBusiness) {
            return res.status(403).json({
                message: 'Business account required to create cards'
            });
        }
        const { error } = card_validation_1.createCardSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details?.[0]?.message || 'Validation error'
            });
        }
        const cardData = {
            ...req.body,
            owner: req.user?._id
        };
        const card = new card_model_1.default(cardData);
        await card.save();
        logger_1.logger.info(`Card created: ${card.title} by user ${req.user?.email}`);
        res.status(201).json({
            success: true,
            message: 'Card created successfully',
            card
        });
    }
    catch (error) {
        logger_1.logger.error('Error creating card:', { error: String(error) });
        let errorMessage;
        if (error instanceof Error && error.name === 'NetworkError') {
            errorMessage = error.message;
        }
        else if (error instanceof Error) {
            errorMessage = error.message || 'Error creating card';
        }
        else {
            errorMessage = 'Error creating card';
        }
        res.status(500).json({ message: errorMessage });
    }
};
exports.createCard = createCard;
const getAllCards = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const cards = await card_model_1.default.find()
            .populate('user_id', 'firstName lastName')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await card_model_1.default.countDocuments();
        res.json({
            success: true,
            message: 'Cards retrieved successfully',
            cards,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get all cards error:', { error: String(error) });
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllCards = getAllCards;
const getMyCards = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const userId = req.user?._id;
        const cards = await card_model_1.default.find({ user_id: userId })
            .populate('user_id', 'firstName lastName')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await card_model_1.default.countDocuments({ user_id: userId });
        res.json({
            success: true,
            message: 'My cards retrieved successfully',
            cards,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get my cards error:', { error: String(error) });
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMyCards = getMyCards;
const getCardById = async (req, res) => {
    try {
        const cardId = req.params.id;
        const card = await card_model_1.default.findById(cardId)
            .populate('user_id', 'firstName lastName email');
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.json({
            success: true,
            message: 'Card retrieved successfully',
            card
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching card by ID:', { error: String(error) });
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCardById = getCardById;
const updateCard = async (req, res) => {
    try {
        const { error } = card_validation_1.updateCardSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details?.[0]?.message || 'Validation error'
            });
        }
        const cardId = req.params.id;
        const userId = req.user?._id;
        const card = await card_model_1.default.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== userId?.toString() && !req.user?.isAdmin) {
            return res.status(403).json({
                message: 'Access denied. You can only update your own cards.'
            });
        }
        const updatedCard = await card_model_1.default.findByIdAndUpdate(cardId, { $set: req.body }, { new: true, runValidators: true }).populate('user_id', 'firstName lastName');
        logger_1.logger.info(`Card updated: ${updatedCard?.title} by user ${req.user?.email}`);
        res.json({
            success: true,
            message: 'Card updated successfully',
            card: updatedCard
        });
    }
    catch (error) {
        logger_1.logger.error('Update card error:', { error: String(error) });
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCard = updateCard;
const deleteCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const userId = req.user?._id;
        const card = await card_model_1.default.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== userId?.toString() && !req.user?.isAdmin) {
            return res.status(403).json({
                message: 'Access denied. You can only delete your own cards.'
            });
        }
        await card_model_1.default.findByIdAndDelete(cardId);
        logger_1.logger.info(`Card deleted: ${card.title} by user ${req.user?.email}`);
        res.json({
            success: true,
            message: 'Card deleted successfully'
        });
    }
    catch (error) {
        logger_1.logger.error('Delete card error:', { error: String(error) });
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCard = deleteCard;
const likeCard = async (req, res) => {
    const cardId = req.params.id;
    if (!cardId) {
        return res.status(400).json({ message: 'Card ID is required' });
    }
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const card = await card_model_1.default.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        const isLiked = card.likes.some((id) => id.toString() === userId);
        if (isLiked) {
            card.likes = card.likes.filter(id => id.toString() !== userId);
        }
        else {
            card.likes.push(userId);
        }
        await card.save();
        logger_1.logger.info(`Card ${isLiked ? 'unliked' : 'liked'}: ${card.title} by user ${req.user?.email}`);
        res.json({
            success: true,
            message: `Card ${isLiked ? 'unliked' : 'liked'} successfully`,
            card,
            isLiked: !isLiked
        });
    }
    catch (error) {
        logger_1.logger.error('Like card error:', { error: String(error) });
        res.status(500).json({ message: 'Server error' });
    }
};
exports.likeCard = likeCard;
