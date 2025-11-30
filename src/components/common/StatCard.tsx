import React, { useState, useEffect } from 'react';
import Card3D from './Card3D';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
  gradient: [string, string];
  trend?: string;
  up?: boolean;
  chartData?: number[];
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix = '',
  icon,
  gradient,
  trend,
  up = true,
  chartData = [],
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const startDelay = delay;

    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - start - startDelay;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.round(value * eased));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, startDelay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const maxChart = Math.max(...chartData, 1);

  return (
    <Card3D
      className={clsx(
        'glass-card p-7 opacity-0 animate-fade-in-up',
        `animation-delay-${delay}`
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Glow Effect */}
      <div
        className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl animate-pulse-glow"
        style={{
          background: `radial-gradient(circle, ${gradient[0]}15 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}20, ${gradient[1]}10)`,
              border: `1px solid ${gradient[0]}30`,
            }}
          >
            {icon}
          </div>

          {trend && (
            <div
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1',
                up
                  ? 'bg-amc-green/10 border border-amc-green/20 text-amc-green'
                  : 'bg-amc-red/10 border border-amc-red/20 text-amc-red'
              )}
            >
              {up ? '↑' : '↓'} {trend}%
            </div>
          )}
        </div>

        {/* Value */}
        <div
          className="text-4xl font-bold leading-none mb-1"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {displayValue}{suffix}
        </div>

        {/* Label */}
        <div className="text-white/50 text-sm font-medium mb-4">{label}</div>

        {/* Mini Chart */}
        {chartData.length > 0 && (
          <div className="h-10 flex items-end gap-1">
            {chartData.slice(-10).map((val, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-500"
                style={{
                  background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})`,
                  height: `${(val / maxChart) * 100}%`,
                  opacity: 0.6 + (i / 10) * 0.4,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Card3D>
  );
};

export default StatCard;
