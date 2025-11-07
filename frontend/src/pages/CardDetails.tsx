import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Building,
  Calendar,
  Loader2,
  ExternalLink,
  Share2,
  Edit,
  Trash2
} from 'lucide-react';
import { Card as CardType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { cardsAPI } from '../services/api';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCard = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cardsAPI.getCardById(id);
      setCard(response.card!);
      setRetryCount(0);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('cards.error_loading');
      setError(errorMessage);
      
      if (error.response?.status === 404) {
        toast.error(t('cards.not_found'));
        navigate('/cards');
      } else if (retryCount < 2) {
        // Retry up to 2 times for network errors
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchCard();
        }, 1000 * (retryCount + 1));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate, t, retryCount]);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  const handleLike = async () => {
    if (!user) {
      toast.error(t('cards.login_required'));
      navigate('/login');
      return;
    }

    if (!card) return;

    setLikeLoading(true);
    try {
      await cardsAPI.likeCard(card._id);
      
      const isCurrentlyLiked = card.likes.includes(user._id);
      setCard({
        ...card,
        likes: isCurrentlyLiked
          ? card.likes.filter(uid => uid !== user._id)
          : [...card.likes, user._id]
      });
      
      toast.success(isCurrentlyLiked ? t('cards.unliked') : t('cards.liked'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">{t('cards.not_found')}</p>
      </div>
    );
  }

  const isLiked = user ? card.likes.includes(user._id) : false;
  const createdDate = new Date(card.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate('/cards')}
            variant="ghost"
            icon={ArrowLeft}
          >
            {t('common.back')}
          </Button>
        </motion.div>

        {/* Card Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header with Image */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary-500 to-primary-600">
            {card.image?.url && (
              <img
                src={card.image.url}
                alt={card.image.alt || card.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Profile Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{card.title}</h1>
              <p className="text-xl text-white/90">{card.subtitle}</p>
            </div>

            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              disabled={likeLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 right-6 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked
                    ? 'text-red-500 fill-current'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('cards.about')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('cards.contact_info')}
                </h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${card.phone}`}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{card.phone}</span>
                  </a>
                  <a
                    href={`mailto:${card.email}`}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{card.email}</span>
                  </a>
                  {card.web && (
                    <a
                      href={card.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Globe className="w-5 h-5 mr-3 text-primary-500" />
                      <span className="flex items-center">
                        {card.web.replace(/^https?:\/\//, '')}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('cards.location')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{card.address?.street} {card.address?.houseNumber}</p>
                      <p>{card.address?.city}{card.address?.state && `, ${card.address.state}`}</p>
                      <p>{card.address?.country} {card.address?.zip && `- ${card.address.zip}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {t('cards.business_number')}: {card.bizNumber}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {createdDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {card.likes.length} {card.likes.length === 1 ? t('cards.like') : t('cards.likes_plural')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => window.location.href = `mailto:${card.email}`}
                  fullWidth
                  icon={Mail}
                  className="sm:flex-1"
                >
                  {t('cards.send_email')}
                </Button>
                <Button
                  onClick={() => window.location.href = `tel:${card.phone}`}
                  variant="outline"
                  fullWidth
                  icon={Phone}
                  className="sm:flex-1"
                >
                  {t('cards.call')}
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: card.title,
                        text: card.description,
                        url: window.location.href,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success(t('common.link_copied'));
                    }
                  }}
                  variant="ghost"
                  icon={Share2}
                  className="sm:flex-1"
                >
                  {t('common.share')}
                </Button>
                
                {user && (user._id === card.user_id || user.isAdmin) && (
                  <>
                    <Button
                      onClick={() => navigate(`/cards/${card._id}/edit`)}
                      variant="ghost"
                      icon={Edit}
                      className="sm:flex-1"
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      onClick={async () => {
                        if (window.confirm(t('cards.delete_confirm'))) {
                          try {
                            await cardsAPI.deleteCard(card._id);
                            toast.success(t('cards.deleted_success'));
                            navigate('/cards');
                          } catch (error: any) {
                            toast.error(error.response?.data?.message || t('common.error'));
                          }
                        }
                      }}
                      variant="ghost"
                      icon={Trash2}
                      className="sm:flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {t('common.delete')}
                    </Button>
                  </>
                )}
              </div>

              {/* Error State with Retry */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm mb-3">{error}</p>
                  <Button
                    onClick={fetchCard}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('common.retry')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardDetails;
