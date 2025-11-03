import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2, Search } from 'lucide-react';
import { Card as CardType } from '../types';
import { useAuth } from '../context/AuthContext';
import { cardsAPI } from '../services/api';
import Card from '../components/Card';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { user } = useAuth();
  const [favoriteCards, setFavoriteCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  const fetchFavoriteCards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Récupérer toutes les cartes et filtrer celles que l'utilisateur a likées
      const response = await cardsAPI.getAllCards(1, 100);
      if (response?.cards) {
        const likedCards = response.cards.filter(card => 
          card.likes?.includes(user._id)
        );
        setFavoriteCards(likedCards);
      }
    } catch (error: any) {
      console.error('Error loading favorite cards:', error);
      toast.error('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteCards();
  }, [user]);

  const handleUnlike = async (cardId: string) => {
    if (!user) return;

    setLikeLoading(cardId);
    try {
      await cardsAPI.likeCard(cardId);
      
      // Retirer la carte des favoris localement
      setFavoriteCards(prev => prev.filter(card => card._id !== cardId));
      
      toast.success('Card removed from favorites', { duration: 2000 });
    } catch (error: any) {
      console.error('Unlike error:', error);
      toast.error('Error removing from favorites');
    } finally {
      setLikeLoading(null);
    }
  };

  const filteredCards = favoriteCards.filter(card => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      card.title?.toLowerCase().includes(searchLower) ||
      card.subtitle?.toLowerCase().includes(searchLower) ||
      card.description?.toLowerCase().includes(searchLower) ||
      card.email?.toLowerCase().includes(searchLower)
    );
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Sign in to see your favorites
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              My Favorites
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Find all the cards you've liked
          </p>
          
          {/* Search Bar */}
          {favoriteCards.length > 0 && (
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in your favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading your favorites...
            </span>
          </div>
        ) : filteredCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {searchTerm ? 'No results found' : 'No favorites yet'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try different keywords'
                : 'Explore cards and click ❤️ to add them to your favorites'
              }
            </p>
            {!searchTerm && (
              <motion.a
                href="/cards"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Discover Cards
              </motion.a>
            )}
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Favorites
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredCards.length} card{filteredCards.length > 1 ? 's' : ''} 
                    {searchTerm && ` found`}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </motion.div>

            {/* Cards Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Favorite badge - shows this card is loved */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  
                  <Card
                    card={card}
                    onLike={handleUnlike}
                    isLoading={likeLoading === card._id}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
