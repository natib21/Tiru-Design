import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: {
      appName: 'TiruDesign',
      welcome: 'Welcome to TiruDesign',
      login: 'Log in',
      signup: 'Sign up',
      logout: 'Log out',
      notFound: 'Page not found',
      backToHome: 'Back to home',
    },
  },
  am: {
    common: {
      appName: 'ጥሩ ዲዛይን',
      welcome: 'ወደ ጥሩ ዲዛይን እንኳን በደህና መጡ',
      login: 'ግባ',
      signup: 'ተመዝገብ',
      logout: 'ውጣ',
      notFound: 'ገጹ አልተገኘም',
      backToHome: 'ወደ ዋናው ገጽ',
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
export default i18n;
