import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo and Tagline */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Cardify</span>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
            {t('footer.tagline')}
          </p>

          {/* Copyright */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{t('footer.rights')}</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
