import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Globe, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { Card as CardType, User } from '../types';
import { useAuth } from '../context/AuthContext';

interface CardProps {
  card: CardType;
  onLike?: (cardId: string) => void;
  onEdit?: (card: CardType) => void;
  onDelete?: (cardId: string) => void;
  isLoading?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onLike, onEdit, onDelete, isLoading = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isOwner = user && typeof card.user_id === 'string' 
    ? card.user_id === user._id 
    : user && typeof card.user_id === 'object' 
    ? (card.user_id as User)._id === user._id 
    : false;
  
  const isLiked = user ? card.likes?.includes(user._id) || false : false;
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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-[650px] flex flex-col"
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
      <div className="pt-8 p-6 flex-1 flex flex-col">
        {/* Header Info */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-3 leading-tight min-h-[3.5rem]" title={card.title}>
            {card.title}
          </h3>
          <p className="text-primary-600 dark:text-primary-400 font-medium mb-3 line-clamp-3 h-12 text-sm leading-tight" title={card.subtitle || ''}>
            {card.subtitle || 'No profession specified'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4 h-20 leading-relaxed" title={card.description || ''}>
            {card.description || 'No description available'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 min-h-[24px]">
            <Phone className="w-4 h-4 mr-3 text-primary-500 flex-shrink-0 mt-1" />
            <span className="break-all leading-relaxed font-medium">{card.phone}</span>
          </div>
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 min-h-[24px]">
            <Mail className="w-4 h-4 mr-3 text-primary-500 flex-shrink-0 mt-1" />
            <span className="break-all leading-relaxed font-medium" title={card.email}>{card.email}</span>
          </div>
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 min-h-[24px]">
            <Globe className="w-4 h-4 mr-3 text-primary-500 flex-shrink-0 mt-1" />
            {card.web ? (
              <a
                href={card.web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 break-all leading-relaxed font-medium underline"
                title={card.web}
              >
                {card.web.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 leading-relaxed italic">No website specified</span>
            )}
          </div>
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 min-h-[24px]">
            <MapPin className="w-4 h-4 mr-3 text-primary-500 flex-shrink-0 mt-1" />
            <span className="leading-relaxed font-medium" title={`${card.address?.city || 'City not specified'}, ${card.address?.country || 'Country not specified'}`}>
              {card.address?.city || 'City not specified'}, {card.address?.country || 'Country not specified'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {card.likes?.length || 0} {(card.likes?.length || 0) === 1 ? 'like' : 'likes'}
            </span>
            {cardUser && (
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                by {cardUser.firstName} {cardUser.lastName}
              </span>
            )}
          </div>
          
          {/* Action buttons - always visible for better UX */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/cards/${card._id}`)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base"
            >
              📋 View Details
            </button>
            <button
              onClick={() => window.open(`mailto:${card.email}`, '_blank')}
              className="w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base"
            >
              ✉️ Contact
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
