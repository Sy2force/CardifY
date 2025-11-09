import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Globe, Phone, Mail, MapPin, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Card as CardType, User } from '../types';
import { useAuth } from '../hooks/useAuth';

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDelete) {
      // eslint-disable-next-line no-console
      console.error('onDelete function is not provided');
      return;
    }
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ? Cette action ne peut pas être annulée.')) {
      return;
    }
    
    try {
      await onDelete(card._id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleDelete:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col group"
    >
      {/* Card Header with Image */}
      <div className="relative h-40 bg-gradient-to-br from-primary-500 to-primary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        {card.image?.url ? (
          <img
            src={card.image.url}
            alt={card.image.alt || card.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {card.title.charAt(0).toUpperCase()}
            </span>
          </div>
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
              disabled={isLoading}
              data-testid="delete-card-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              title="Supprimer cette carte"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
            </motion.button>
          </div>
        )}

        {/* Profile Avatar */}
        <div className="absolute -bottom-5 left-4">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border-3 border-white dark:border-gray-800 shadow-lg overflow-hidden">
            {card.image?.url ? (
              <img
                src={card.image.url}
                alt={card.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {card.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-6 p-4 flex-1 flex flex-col">
        {/* Header Info */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight" title={card.title}>
            {card.title}
          </h3>
          <p className="text-primary-600 dark:text-primary-400 font-medium mb-2 line-clamp-1 text-sm" title={card.subtitle || ''}>
            {card.subtitle || 'Profession non spécifiée'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-3 leading-relaxed" title={card.description || ''}>
            {card.description || 'Aucune description disponible'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Phone className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
            <span className="truncate font-medium">{card.phone}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Mail className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
            <span className="truncate font-medium" title={card.email}>{card.email}</span>
          </div>
          {card.web && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Globe className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
              <a
                href={card.web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 truncate font-medium hover:underline flex items-center"
                title={card.web}
              >
                {card.web.replace(/^https?:\/\//, '')}
                <ExternalLink className="w-2 h-2 ml-1 opacity-60" />
              </a>
            </div>
          )}
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <MapPin className="w-3 h-3 mr-2 text-primary-500 flex-shrink-0" />
            <span className="truncate font-medium" title={`${card.address?.city || 'Ville non spécifiée'}, ${card.address?.country || 'Pays non spécifié'}`}>
              {card.address?.city || 'Ville non spécifiée'}, {card.address?.country || 'Pays non spécifié'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {card.likes?.length || 0} j'aime{(card.likes?.length || 0) > 1 ? 's' : ''}
            </span>
            {cardUser && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                par {cardUser.firstName} {cardUser.lastName}
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="space-y-2">
            <motion.button
              onClick={() => navigate(`/cards/${card._id}`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center"
            >
              Voir les détails
            </motion.button>
            <motion.button
              onClick={() => window.open(`mailto:${card.email}`, '_blank')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center"
            >
              Contacter
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
