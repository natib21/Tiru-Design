import React from 'react';

export interface TemplateCardProps {
  title: string;
  category?: string;
  dimensions?: string;
  badge?: string;
  thumbnailUrl?: string;
  onUse?: () => void;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  category,
  dimensions = '1920 × 1080',
  badge,
  onUse,
  className = '',
}) => {
  return (
    <div
      className={`group relative flex flex-col rounded-xl border border-border bg-surface overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-sm transition-all ${className}`}
    >
      {/* Aspect Ratio Preview container */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        {/* Placeholder decorative frame */}
        <div className="w-full h-full rounded border border-white/60 bg-white/40 dark:bg-black/20 flex flex-col items-center justify-center p-2 text-center">
          <span className="text-xs font-semibold text-text-secondary truncate max-w-[90%]">
            {title}
          </span>
          <span className="text-[10px] text-text-tertiary tabular-nums mt-0.5">
            {dimensions}
          </span>
        </div>

        {badge && (
          <span className="absolute top-2.5 right-2.5 rounded bg-amber-100 text-warning-text px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      {/* Info footer */}
      <div className="flex items-center justify-between p-3.5">
        <div className="min-w-0 pr-2">
          <h4 className="text-xs font-bold text-foreground truncate">{title}</h4>
          {category && (
            <p className="text-[11px] text-text-tertiary truncate">{category}</p>
          )}
        </div>
        {onUse && (
          <button
            type="button"
            onClick={onUse}
            className="shrink-0 rounded-md bg-surface border border-border px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
          >
            Use
          </button>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
