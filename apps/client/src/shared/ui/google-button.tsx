import React from 'react';

export interface GoogleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  text = 'Continue with Google',
  className = '',
  disabled,
  ...rest
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex min-h-[44px] w-full items-center justify-center gap-3 rounded-lg border border-[#BEC7D3] bg-white px-4 py-2.5 text-sm font-medium text-[#0f172a] shadow-sm transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006399] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...rest}
    >
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.4 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
        />
      </svg>
      <span>{text}</span>
    </button>
  );
};

export default GoogleButton;
