import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Palette, Share2, CreditCard, Users, Globe } from 'lucide-react';
import Button from '../components/Button';

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: t('landing.features.feature1.title'),
      description: t('landing.features.feature1.description'),
    },
    {
      icon: Palette,
      title: t('landing.features.feature2.title'),
      description: t('landing.features.feature2.description'),
    },
    {
      icon: Share2,
      title: t('landing.features.feature3.title'),
      description: t('landing.features.feature3.description'),
    },
  ];

  const stats = [
    { icon: CreditCard, value: '1000+', label: t('stats.cardsCreated') },
    { icon: Users, value: '500+', label: t('stats.professionalsConnected') },
    { icon: Globe, value: '3', label: t('stats.languagesSupported') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-primary-200/20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              {t('landing.hero.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-medium mb-4"
            >
              {t('landing.hero.subtitle')}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
            >
              {t('landing.hero.description')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="text-lg px-8 py-4 bg-primary-600 text-white hover:bg-primary-700 font-bold shadow-lg border-2 border-primary-500 hover:border-primary-600 transition-all duration-300 hover:shadow-xl"
              >
                {t('landing.hero.cta')}
              </Button>
              <Button
                onClick={() => navigate('/cards')}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
              >
                {t('landing.hero.cta_secondary')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.features.title')}
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-full mb-6">
                  <feature.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('cta.readyToCreate')}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t('cta.joinHundreds')}
            </p>
            <Button
              onClick={() => navigate('/register')}
              variant="secondary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="bg-primary-600 text-white hover:bg-primary-700 hover:text-white text-lg px-8 py-4 font-bold shadow-xl border-2 border-primary-500 hover:border-primary-600 transition-all duration-300"
            >
              {t('landing.hero.cta')}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
