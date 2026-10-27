import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'outline';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface border border-border shadow-xs',
      subtle: 'bg-surface-subtle border border-border-subtle',
      outline: 'bg-transparent border border-border',
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl p-5 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
