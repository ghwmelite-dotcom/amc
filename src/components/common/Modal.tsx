import React, { useEffect, useCallback, ReactNode, useState } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useAppStore } from '../../stores/appStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  mobileStyle?: 'center' | 'bottom-sheet';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  mobileStyle = 'bottom-sheet',
}) => {
  const { playSound } = useSoundEffects();
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);

  const handleClose = useCallback(() => {
    if (soundEnabled) {
      playSound('click');
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [soundEnabled, playSound, onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  // Touch handlers for swipe-to-close on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (mobileStyle === 'bottom-sheet') {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null && mobileStyle === 'bottom-sheet') {
      const currentTouch = e.touches[0].clientY;
      const delta = currentTouch - touchStart;
      if (delta > 0) {
        setTouchDelta(delta);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchDelta > 100) {
      handleClose();
    }
    setTouchStart(null);
    setTouchDelta(0);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeStyles: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className={clsx(
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
          isClosing ? 'opacity-0' : 'opacity-100'
        )}
        onClick={handleClose}
      />

      {/* Modal - Bottom sheet on mobile, centered on desktop */}
      <div
        className={clsx(
          'relative w-full glass-card overflow-hidden transition-all duration-200 no-tap-highlight',
          // Mobile bottom sheet styles
          mobileStyle === 'bottom-sheet' && 'md:rounded-3xl rounded-t-3xl rounded-b-none',
          mobileStyle === 'center' && 'rounded-3xl mx-4',
          // Size styles (only apply on desktop for bottom-sheet)
          mobileStyle === 'bottom-sheet' ? `md:${sizeStyles[size]}` : sizeStyles[size],
          // Animation states
          isClosing
            ? mobileStyle === 'bottom-sheet'
              ? 'translate-y-full md:translate-y-0 md:scale-95 md:opacity-0'
              : 'scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100 animate-slide-up md:animate-scale-in',
          // Max height for bottom sheet
          mobileStyle === 'bottom-sheet' && 'max-h-[90vh] md:max-h-[85vh]'
        )}
        style={{
          transform: touchDelta > 0 ? `translateY(${touchDelta}px)` : undefined,
          transition: touchDelta > 0 ? 'none' : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Bottom sheet handle (mobile only) */}
        {mobileStyle === 'bottom-sheet' && (
          <div className="md:hidden pt-3 pb-1">
            <div className="bottom-sheet-handle" />
          </div>
        )}

        {/* Header */}
        <div className={clsx(
          'px-4 md:px-6',
          mobileStyle === 'bottom-sheet' ? 'pt-2 md:pt-6' : 'pt-6'
        )}>
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4 md:mb-6">
              {title && (
                <h2 className="text-lg md:text-xl font-semibold text-white">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="p-2 md:p-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors touch-target"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content with safe area padding */}
        <div
          className="px-4 md:px-6 pb-4 md:pb-6 overflow-y-auto momentum-scroll"
          style={{
            maxHeight: 'calc(90vh - 100px)',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
