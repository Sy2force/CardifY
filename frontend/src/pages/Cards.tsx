import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Card as CardType } from '../types';
import { useAuth } from '../context/AuthContext';
import { cardsAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cards: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  const fetchCards = async (pageNum: number = 1, reset: boolean = false) => {
    setLoading(true);
    
    try {
      console.log('Fetching cards, page:', pageNum);
      const response = await cardsAPI.getAllCards(pageNum, 12);
      console.log('Cards response:', response);
      
      if (response && response.cards && Array.isArray(response.cards)) {
        if (reset) {
          setCards(response.cards);
        } else {
          setCards(prev => [...prev, ...(response.cards || [])]);
        }
        
        setHasMore(
          response.pagination ? 
          pageNum < response.pagination.pages : 
          false
        );
        
        setPage(pageNum);
        console.log('Cards loaded successfully, count:', response.cards.length);
      } else {
        console.warn('No cards in response:', response);
        setCards([]);
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('Cards loading error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || t('cards.error_loading') || 'Erreur lors du chargement des cartes');
      setCards([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(1, true);
  }, []);

  const handleLike = async (cardId: string) => {
    if (!user) {
      toast.error(t('cards.login_required'));
      return;
    }

    setLikeLoading(cardId);
    try {
      await cardsAPI.likeCard(cardId);
      
      // Update the card in the local state
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('common.error'));
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

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Cards Grid */}
        {loading && page === 1 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {t('cards.loading')}
            </span>
          </div>
        ) : filteredCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🃏</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {t('cards.no_cards')}
            </p>
            {user && user.isBusiness && (
              <Button
                onClick={() => navigate('/dashboard')}
                icon={Plus}
              >
                {t('cards.create')}
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  loading={loading}
                  variant="outline"
                  size="lg"
                >
                  {t('cards.load_more')}
                </Button>
              </div>
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
