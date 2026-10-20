import React from 'react';

export const LanguageSelector: React.FC<{ value?: string; onChange?: (v: string) => void }> = ({ value = 'en', onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange?.(e.target.value)} className="text-sm px-2 py-1 border rounded">
      <option value="en">English</option>
      <option value="am">አማርኛ</option>
    </select>
  );
};

export default LanguageSelector;
