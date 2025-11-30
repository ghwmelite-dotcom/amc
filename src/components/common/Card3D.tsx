import React, { useState, useRef, useCallback, ReactNode } from 'react';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useAppStore } from '../../stores/appStore';
import { clsx } from 'clsx';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  intensity?: number;
  disabled?: boolean;
  glareEnabled?: boolean;
  style?: React.CSSProperties;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  onClick,
  intensity = 15,
  disabled = false,
  glareEnabled = true,
  style,
}) => {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSoundEffects();
  const soundEnabled = useAppStore((state) => state.soundEnabled);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      );

      if (glareEnabled) {
        setGlare({
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          opacity: 0.15,
        });
      }
    },
    [disabled, intensity, glareEnabled]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (soundEnabled && !disabled) {
      playSound('hover');
    }
  }, [soundEnabled, disabled, playSound]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (soundEnabled) {
      playSound('click');
    }
    onClick?.();
  }, [disabled, soundEnabled, playSound, onClick]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={clsx(
        'relative overflow-hidden transition-transform duration-100 ease-out',
        !disabled && onClick && 'cursor-pointer',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {/* Glare effect */}
      {glareEnabled && (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 60%)`,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      {children}
    </div>
  );
};

export default Card3D;
