import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useAppStore } from '../../stores/appStore';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
}) => {
  const { playSound } = useSoundEffects();
  const soundEnabled = useAppStore((state) => state.soundEnabled);

  const handleClick = () => {
    if (disabled || loading) return;
    if (soundEnabled) {
      playSound('click');
    }
    onClick?.();
  };

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amc-dark';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-amc-teal to-amc-blue text-white shadow-glow-teal hover:-translate-y-0.5 hover:shadow-lg focus:ring-amc-teal',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 focus:ring-white/20',
    ghost: 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white focus:ring-white/10',
    danger: 'bg-amc-red text-white hover:bg-amc-red/90 focus:ring-amc-red shadow-glow-red',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
