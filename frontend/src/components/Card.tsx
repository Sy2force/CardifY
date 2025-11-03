import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, Globe, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { Card as CardType, User } from '../types';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

interface CardProps {
  card: CardType;
  onLike?: (cardId: string) => void;
  onEdit?: (card: CardType) => void;
  onDelete?: (cardId: string) => void;
  isLoading?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onLike, onEdit, onDelete, isLoading = false }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isOwner = user && typeof card.user_id === 'string' 
    ? card.user_id === user._id 
    : user && typeof card.user_id === 'object' 
    ? (card.user_id as User)._id === user._id 
    : false;
  
  const isLiked = user ? card.likes.includes(user._id) : false;
  const cardUser = typeof card.user_id === 'object' ? card.user_id as User : null;

  const handleLike = () => {
    if (onLike && user) {
      onLike(card._id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(card);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      onDelete(card._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Card Header with Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {card.image?.url && (
          <img
            src={card.image.url}
            alt={card.image.alt || card.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Like Button */}
        {user && !isOwner && (
          <motion.button
            onClick={handleLike}
            disabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked
                  ? 'text-red-500 fill-current'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </motion.button>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <div className="absolute top-4 right-4 flex space-x-2">
            <motion.button
              onClick={handleEdit}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Edit className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </motion.button>
            <motion.button
              onClick={handleDelete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </motion.button>
          </div>
        )}

        {/* Profile Avatar */}
        <div className="absolute -bottom-6 left-6">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
            {card.image?.url ? (
              <img
                src={card.image.url}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {card.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-8 p-6">
        {/* Header Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {card.title}
          </h3>
          <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
            {card.subtitle}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {card.description}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 mr-2 text-primary-500" />
            <span>{card.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 mr-2 text-primary-500" />
            <span className="truncate">{card.email}</span>
          </div>
          {card.web && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Globe className="w-4 h-4 mr-2 text-primary-500" />
              <a
                href={card.web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 truncate"
              >
                {card.web.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
            <span className="truncate">
              {card.address.city}, {card.address.country}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {card.likes.length} {card.likes.length === 1 ? 'like' : 'likes'}
            </span>
            {cardUser && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                par {cardUser.firstName} {cardUser.lastName}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/cards/${card._id}`)}
            >
              {t('cards.discover')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`mailto:${card.email}`, '_blank')}
            >
              {t('cards.contact')}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
