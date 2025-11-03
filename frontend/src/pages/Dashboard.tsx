import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Heart, 
  Eye, 
  CreditCard,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { Card as CardType, CardFormData } from '../types';
import { useAuth } from '../context/AuthContext';
import { cardsAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import toast from 'react-hot-toast';

const cardSchema = yup.object({
  title: yup
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must not exceed 100 characters')
    .required('Title is required'),
  subtitle: yup
    .string()
    .min(2, 'Subtitle must be at least 2 characters')
    .max(100, 'Subtitle must not exceed 100 characters')
    .required('Subtitle is required'),
  description: yup
    .string()
    .min(2, 'Description must be at least 2 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .required('Description is required'),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .required('Phone is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  web: yup
    .string()
    .url('Please enter a valid URL')
    .optional(),
  address: yup.object({
    country: yup.string().min(2).max(50).required('Country is required'),
    city: yup.string().min(2).max(50).required('City is required'),
    street: yup.string().min(2).max(100).required('Street is required'),
    houseNumber: yup.string().min(1).max(20).required('House number is required'),
    state: yup.string().max(50).optional(),
    zip: yup.string().max(10).optional(),
  }).required(),
  image: yup.object({
    url: yup.string().url('Please enter a valid image URL').optional(),
    alt: yup.string().max(100).optional(),
  }).optional(),
});

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CardFormData>({
    resolver: yupResolver(cardSchema),
  });

  const fetchMyCards = async () => {
    setLoading(true);
    try {
      const response = await cardsAPI.getMyCards();
      setCards(response.cards || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des cartes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isBusiness) {
      fetchMyCards();
    } else {
      setLoading(false);
    }
  }, [user]);

  const openCreateForm = () => {
    setEditingCard(null);
    reset({
      title: '',
      subtitle: '',
      description: '',
      phone: '',
      email: user?.email || '',
      web: '',
      image: {
        url: '',
        alt: ''
      },
      address: {
        country: '',
        city: '',
        street: '',
        houseNumber: '',
        state: '',
        zip: ''
      }
    });
    setIsFormOpen(true);
  };

  const openEditForm = (card: CardType) => {
    setEditingCard(card);
    setValue('title', card.title);
    setValue('subtitle', card.subtitle);
    setValue('description', card.description);
    setValue('phone', card.phone);
    setValue('email', card.email);
    setValue('web', card.web || '');
    setValue('image.url', card.image?.url || '');
    setValue('image.alt', card.image?.alt || '');
    setValue('address.country', card.address.country);
    setValue('address.city', card.address.city);
    setValue('address.street', card.address.street);
    setValue('address.houseNumber', card.address.houseNumber);
    setValue('address.state', card.address.state || '');
    setValue('address.zip', card.address.zip || '');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCard(null);
    reset();
  };

  const onSubmit = async (data: CardFormData) => {
    setFormLoading(true);
    try {
      if (editingCard) {
        const response = await cardsAPI.updateCard(editingCard._id, data);
        setCards(prev => prev.map(card => 
          card._id === editingCard._id ? response.card! : card
        ));
        toast.success(t('card.form.success_updated'));
      } else {
        const response = await cardsAPI.createCard(data);
        setCards(prev => [response.card!, ...prev]);
        toast.success(t('card.form.success_created'));
      }
      closeForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await cardsAPI.deleteCard(cardId);
      setCards(prev => prev.filter(card => card._id !== cardId));
      toast.success(t('card.form.success_deleted'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('card.form.error_delete'));
    }
  };

  const stats = {
    totalCards: cards.length,
    totalLikes: cards.reduce((sum, card) => sum + card.likes.length, 0),
    totalViews: cards.length * 42 // Mock data
  };

  if (!user?.isBusiness) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Accès restreint
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Le tableau de bord est réservé aux comptes professionnels. 
            Créez un compte professionnel pour accéder à cette fonctionnalité.
          </p>
          <Button variant="primary" size="lg">
            Passer au compte professionnel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('dashboard.welcome', { name: user?.firstName })}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.stats.total_cards')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalCards}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.stats.total_likes')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalLikes}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.stats.profile_views')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalViews}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* My Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.my_cards.title')}
                </h2>
                <Button
                  onClick={openCreateForm}
                  icon={Plus}
                >
                  {t('dashboard.my_cards.create')}
                </Button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : cards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🃏</div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {t('dashboard.my_cards.empty')}
                  </p>
                  <Button
                    onClick={openCreateForm}
                    icon={Plus}
                    size="lg"
                  >
                    {t('dashboard.my_cards.create')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <Card
                      key={card._id}
                      card={card}
                      onEdit={openEditForm}
                      onDelete={handleDeleteCard}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Card Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingCard ? t('card.form.edit_title') : t('card.form.title')}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    aria-label="Fermer le formulaire"
                    title="Fermer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Info Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {t('card.form.personal_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">{t('card.form.title_label')}</label>
                        <input
                          {...register('title')}
                          type="text"
                          className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.fullName')}
                        />
                        {errors.title && <p className="form-error">{errors.title.message}</p>}
                      </div>

                      <div>
                        <label className="form-label">{t('card.form.subtitle_label')}</label>
                        <input
                          {...register('subtitle')}
                          type="text"
                          className={`form-input ${errors.subtitle ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.profession')}
                        />
                        {errors.subtitle && <p className="form-error">{errors.subtitle.message}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="form-label">{t('card.form.description_label')}</label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        className={`form-input ${errors.description ? 'border-red-500' : ''}`}
                        placeholder={t('placeholders.description')}
                      />
                      {errors.description && <p className="form-error">{errors.description.message}</p>}
                    </div>

                    <div className="mt-4">
                      <label className="form-label">{t('card.form.image_url_label')}</label>
                      <input
                        {...register('image.url')}
                        type="url"
                        className={`form-input ${errors.image?.url ? 'border-red-500' : ''}`}
                        placeholder={t('placeholders.profileImage')}
                      />
                      {errors.image?.url && <p className="form-error">{errors.image.url.message}</p>}
                    </div>
                  </div>

                  {/* Contact Info Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {t('card.form.contact_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">{t('card.form.phone_label')}</label>
                        <input
                          {...register('phone')}
                          type="tel"
                          className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.phoneNumber')}
                        />
                        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <label className="form-label">{t('card.form.email_label')}</label>
                        <input
                          {...register('email')}
                          type="email"
                          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.emailAddress')}
                        />
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="form-label">{t('card.form.web_label')}</label>
                      <input
                        {...register('web')}
                        type="url"
                        className={`form-input ${errors.web ? 'border-red-500' : ''}`}
                        placeholder={t('placeholders.website')}
                      />
                      {errors.web && <p className="form-error">{errors.web.message}</p>}
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {t('card.form.address_info')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">{t('card.form.country_label')}</label>
                        <input
                          {...register('address.country')}
                          type="text"
                          className={`form-input ${errors.address?.country ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.country')}
                        />
                        {errors.address?.country && <p className="form-error">{errors.address.country.message}</p>}
                      </div>

                      <div>
                        <label className="form-label">{t('card.form.city_label')}</label>
                        <input
                          {...register('address.city')}
                          type="text"
                          className={`form-input ${errors.address?.city ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.city')}
                        />
                        {errors.address?.city && <p className="form-error">{errors.address.city.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="form-label">{t('card.form.street_label')}</label>
                        <input
                          {...register('address.street')}
                          type="text"
                          className={`form-input ${errors.address?.street ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.street')}
                        />
                        {errors.address?.street && <p className="form-error">{errors.address.street.message}</p>}
                      </div>

                      <div>
                        <label className="form-label">{t('card.form.house_number_label')}</label>
                        <input
                          {...register('address.houseNumber')}
                          type="text"
                          className={`form-input ${errors.address?.houseNumber ? 'border-red-500' : ''}`}
                          placeholder={t('placeholders.houseNumber')}
                        />
                        {errors.address?.houseNumber && <p className="form-error">{errors.address.houseNumber.message}</p>}
                      </div>

                      <div>
                        <label className="form-label">{t('card.form.zip_label')}</label>
                        <input
                          {...register('address.zip')}
                          type="text"
                          className="form-input"
                          placeholder={t('placeholders.zipCode')}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="form-label">{t('card.form.state_label')}</label>
                      <input
                        {...register('address.state')}
                        type="text"
                        className="form-input"
                        placeholder={t('placeholders.state')}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeForm}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      loading={formLoading}
                      icon={Save}
                    >
                      {editingCard ? t('card.form.submit_edit') : t('card.form.submit')}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
