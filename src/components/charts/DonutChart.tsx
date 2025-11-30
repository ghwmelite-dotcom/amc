import React, { useState, useEffect } from 'react';

interface DonutChartProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = '#00D4AA',
  showLabel = true,
  label,
  animated = true,
}) => {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    let start: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (displayValue / max) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 90) return '#00D26A';
    if (percentage >= 80) return '#FFB020';
    return '#FF4757';
  };

  const finalColor = color === 'auto' ? getColor() : color;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={finalColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'stroke-dashoffset 0.3s ease' : 'none',
            filter: `drop-shadow(0 0 8px ${finalColor}40)`,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{displayValue}</span>
          {label && <span className="text-[8px] text-white/50">{label}</span>}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
