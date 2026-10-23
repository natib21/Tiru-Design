// derived, not in Figma
import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';

export const skeletonVariants = cva('animate-pulse bg-surface', {
  variants: {
    shape: {
      default: 'rounded-[8px]',
      card: 'rounded-[16px]',
      circle: 'rounded-full',
    },
  },
  defaultVariants: {
    shape: 'default',
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, shape, ...props }: SkeletonProps) {
  return <div className={cn(skeletonVariants({ shape }), className)} {...props} />;
}
