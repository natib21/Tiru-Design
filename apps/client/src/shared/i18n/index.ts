import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import am from './locales/am.json';

export const defaultNS = 'auth';

export const resources = {
  en,
  am,
} as const;

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'auth',
  ns: ['auth', 'common', 'dashboard', 'projects', 'workspace'],
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
export default i18n;
