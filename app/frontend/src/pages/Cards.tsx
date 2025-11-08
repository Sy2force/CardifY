import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Plus, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Card as CardType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { cardsAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cards = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCards = async (pageNum: number = 1, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setError(null);
    }
    
    try {
      const response = await cardsAPI.getAllCards(pageNum, 12);
      
      if (!response) {
        throw new Error('Aucune réponse du serveur');
      }
      
      if (response.success && response.cards && Array.isArray(response.cards)) {
        const newCards = response.cards;
        
        if (reset) {
          setCards(newCards);
        } else {
          setCards(prev => [...prev, ...newCards]);
        }
        
        setHasMore(
          Boolean(response.pagination && pageNum < response.pagination.pages)
        );
        
        setPage(pageNum);
        setError(null);
        setRetryCount(0);
        
        if (reset && newCards.length === 0) {
          setError('Aucune carte disponible pour le moment');
        }
      } else {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn('Format de réponse inattendu:', response);
        }
        if (reset) {
          setCards([]);
          setError('Aucune carte trouvée');
        }
        setHasMore(false);
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Erreur lors du chargement des cartes:', error);
      }
      
      let errorMessage = 'Erreur lors du chargement des cartes';
      
      // Type guard for error with name property
      if (error && typeof error === 'object' && 'name' in error && error.name === 'NetworkError') {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { message?: string } } };
        if (!axiosError.response) {
          errorMessage = 'Serveur inaccessible. Vérifiez votre connexion internet.';
        } else if (axiosError.response.status === 404) {
          errorMessage = 'Aucune carte trouvée.';
        } else if (axiosError.response.status >= 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (axiosError.response.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      
      if (reset) {
        setCards([]);
        setError(errorMessage);
      } else {
        toast.error(errorMessage);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(1, true);
  }, []);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchCards(1, true);
  };

  const handleLike = async (cardId: string) => {
    if (!user) {
      toast.error(t('cards.login_required') || 'You must be logged in to like a card');
      return;
    }

    setLikeLoading(cardId);
    try {
      await cardsAPI.likeCard(cardId);
      
      // Update the card's like status in our local state
      setCards(prev => prev.map(card => {
        if (card._id === cardId) {
          const isCurrentlyLiked = card.likes.includes(user._id);
          return {
            ...card,
            likes: isCurrentlyLiked
              ? card.likes.filter(id => id !== user._id)
              : [...card.likes, user._id]
          };
        }
        return card;
      }));
      
      // Show a subtle success message to the user
      const isLiked = !cards.find(c => c._id === cardId)?.likes.includes(user._id);
      toast.success(isLiked ? 'Card added to favorites' : 'Card removed from favorites', {
        duration: 2000
      });
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Like error:', error);
      }
      let errorMessage = 'Error updating like status';
      
      // Type guard for axios error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          errorMessage = 'Card not found';
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLikeLoading(null);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchCards(page + 1);
    }
  };

  const filteredCards = cards.filter(card => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      card.title?.toLowerCase().includes(searchLower) ||
      card.subtitle?.toLowerCase().includes(searchLower) ||
      card.description?.toLowerCase().includes(searchLower) ||
      card.email?.toLowerCase().includes(searchLower) ||
      card.phone?.includes(searchTerm) ||
      card.address?.city?.toLowerCase().includes(searchLower) ||
      card.address?.country?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('cards.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t('cards.subtitle')}
          </p>
          
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            {/* Search */}
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('cards.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-input"
                className="form-input pl-10 w-full"
              />
            </div>
            
            {/* Create Card Button (Business users only) */}
            {user && user.isBusiness && (
              <Button
                onClick={() => navigate('/dashboard')}
                icon={Plus}
                className="whitespace-nowrap"
              >
                {t('cards.create')}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Error State */}
        {error && !loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-6">
                {error}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  icon={RefreshCw}
                  className="w-full"
                >
                  Réessayer {retryCount > 0 && `(${retryCount})`}
                </Button>
                {user && user.isBusiness && (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    icon={Plus}
                    className="w-full"
                  >
                    Créer une carte
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : loading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
            <span className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Chargement des cartes...
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Veuillez patienter
            </span>
          </div>
        ) : filteredCards.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🃏</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucune carte trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ? 'Aucune carte ne correspond à votre recherche.' : 'Aucune carte disponible pour le moment.'}
              </p>
              {user && user.isBusiness && (
                <Button
                  onClick={() => navigate('/dashboard')}
                  icon={Plus}
                  className="w-full"
                >
                  Créer la première carte
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="cards-grid"
            >
              {filteredCards.map((card, index) => (
                <motion.div
                  key={`${card._id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.03,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <Card
                    card={card}
                    onLike={handleLike}
                    isLoading={likeLoading === card._id}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12"
              >
                <Button
                  onClick={loadMore}
                  loading={loading && page > 1}
                  variant="outline"
                  size="lg"
                  data-testid="load-more-button"
                  className="min-w-[200px]"
                >
                  {loading && page > 1 ? 'Chargement...' : 'Charger plus de cartes'}
                </Button>
                {cards.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {cards.length} carte{cards.length > 1 ? 's' : ''} affichée{cards.length > 1 ? 's' : ''}
                  </p>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* CTA Section for non-business users */}
        {user && !user.isBusiness && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">
              {t('cards.cta.create_your_card')}
            </h2>
            <p className="text-primary-100 mb-6">
              {t('cards.cta.upgrade_to_business')}
            </p>
            <Button
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-gray-50"
            >
              {t('cards.cta.upgrade_button')}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cards;
