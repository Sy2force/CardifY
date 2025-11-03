import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import frTranslation from '../locales/fr/translation.json';
import enTranslation from '../locales/en/translation.json';
import heTranslation from '../locales/he/translation.json';

const resources = {
  fr: {
    translation: frTranslation,
  },
  en: {
    translation: enTranslation,
  },
  he: {
    translation: heTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default language
    fallbackLng: 'en',
    debug: (import.meta as any).env?.DEV || false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
