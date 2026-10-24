import React, { useEffect, useState } from 'react';

export interface CountdownTimerProps {
  initialSeconds: number;
  onZero?: () => void;
  className?: string;
  showRemainingSuffix?: boolean;
}

function formatCountdownTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onZero,
  className = '',
  showRemainingSuffix = false,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onZero?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onZero?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onZero]);

  const formatted = formatCountdownTime(secondsLeft);

  return (
    <span
      role="timer"
      aria-live="polite"
      className={`font-semibold tabular-nums ${className}`}
    >
      {formatted}
      {showRemainingSuffix ? ' remaining' : ''}
    </span>
  );
};

export default CountdownTimer;
