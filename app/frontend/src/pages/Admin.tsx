import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Shield, Activity, TrendingUp, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cardsAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalCards: number;
  businessUsers: number;
  regularUsers: number;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCards: 0,
    businessUsers: 0,
    regularUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      toast.error('Accès non autorisé');
      navigate('/dashboard');
      return;
    }

    fetchAdminStats();
  }, [user, navigate]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Fetch cards stats
      const cardsResponse = await cardsAPI.getAllCards(1, 1000);
      const totalCards = cardsResponse.cards?.length || 0;

      // Mock user stats (would need a proper admin API endpoint)
      const totalUsers = 15; // Placeholder
      const businessUsers = 8; // Placeholder
      const regularUsers = 7; // Placeholder

      setStats({
        totalUsers,
        totalCards,
        businessUsers,
        regularUsers
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching admin stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  const statCards = [
    {
      title: 'Utilisateurs Total',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Cartes Créées',
      value: stats.totalCards,
      icon: CreditCard,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Comptes Business',
      value: stats.businessUsers,
      icon: UserCheck,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Utilisateurs Standard',
      value: stats.regularUsers,
      icon: Activity,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Administration
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Tableau de bord administrateur - Gestion de la plateforme Cardify
          </p>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-8 text-white"
        >
          <h2 className="text-xl font-semibold mb-2">
            Bienvenue, {user.firstName} {user.lastName}
          </h2>
          <p className="opacity-90">
            Vous avez un accès complet aux fonctionnalités d'administration de Cardify.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? '...' : stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actions Administrateur
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/cards')}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
            >
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Gérer les Cartes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Voir et modérer toutes les cartes
              </p>
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
            >
              <Users className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Gestion Utilisateurs</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Administrer les comptes utilisateurs
              </p>
            </button>
            
            <button
              onClick={() => toast('Fonctionnalité en développement', { icon: 'ℹ️' })}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
            >
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Analytics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Statistiques détaillées
              </p>
            </button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            État du Système
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Backend</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 dark:text-green-400 text-sm">Opérationnel</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Base de Données</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 dark:text-green-400 text-sm">Connectée</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Service d'Upload</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 dark:text-green-400 text-sm">Disponible</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
