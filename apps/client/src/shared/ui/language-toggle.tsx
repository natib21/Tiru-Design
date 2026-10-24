import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'am' ? 'am' : 'en';

  const handleSelect = (lang: 'en' | 'am') => {
    void i18n.changeLanguage(lang);
  };

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center rounded-lg border border-[#BEC7D3] bg-[#F7F9FB] p-0.5 text-xs font-medium text-[#3F4851] ${className}`}
    >
      <button
        type="button"
        aria-pressed={currentLang === 'en'}
        onClick={() => handleSelect('en')}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-2.5 py-1 transition-all ${
          currentLang === 'en'
            ? 'bg-white font-semibold text-[#006399] shadow-sm'
            : 'text-[#3F4851] hover:text-[#0f172a]'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={currentLang === 'am'}
        onClick={() => handleSelect('am')}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-2.5 py-1 transition-all ${
          currentLang === 'am'
            ? 'bg-white font-semibold text-[#006399] shadow-sm'
            : 'text-[#3F4851] hover:text-[#0f172a]'
        }`}
      >
        አማ
      </button>
    </div>
  );
};

export default LanguageToggle;
