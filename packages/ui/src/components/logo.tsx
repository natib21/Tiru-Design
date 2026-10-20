import React from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <div style={{ width: size, height: size }} className="rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">
      TD
    </div>
  );
};

export default Logo;
