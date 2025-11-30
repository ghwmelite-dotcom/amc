import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
  success: {
    bg: 'bg-amc-green/20',
    text: 'text-amc-green',
    border: 'border-amc-green/30',
    dot: 'bg-amc-green',
  },
  warning: {
    bg: 'bg-amc-orange/20',
    text: 'text-amc-orange',
    border: 'border-amc-orange/30',
    dot: 'bg-amc-orange',
  },
  danger: {
    bg: 'bg-amc-red/20',
    text: 'text-amc-red',
    border: 'border-amc-red/30',
    dot: 'bg-amc-red',
  },
  info: {
    bg: 'bg-amc-blue/20',
    text: 'text-amc-blue',
    border: 'border-amc-blue/30',
    dot: 'bg-amc-blue',
  },
  default: {
    bg: 'bg-white/10',
    text: 'text-white/70',
    border: 'border-white/20',
    dot: 'bg-white/50',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
}) => {
  const styles = variantStyles[variant];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        styles.bg,
        styles.text,
        styles.border,
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-2 h-2 rounded-full',
            styles.dot,
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
