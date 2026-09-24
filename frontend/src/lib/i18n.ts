import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import mrTranslation from '../locales/mr/translation.json';

const savedLang = (localStorage.getItem('arogya_lang') as 'en' | 'hi' | 'mr') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      mr: { translation: mrTranslation },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (lang: 'en' | 'hi' | 'mr') => {
  i18n.changeLanguage(lang);
  localStorage.setItem('arogya_lang', lang);
  document.documentElement.lang = lang;
};

export default i18n;
