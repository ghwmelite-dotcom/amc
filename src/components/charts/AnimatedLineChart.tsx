import React, { useState, useEffect } from 'react';

interface AnimatedLineChartProps {
  data: number[];
  color?: string;
  height?: number;
  showDots?: boolean;
  showArea?: boolean;
  animated?: boolean;
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  color = '#00D4AA',
  height = 120,
  showDots = true,
  showArea = true,
  animated = true,
}) => {
  const [progress, setProgress] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) return;

    let start: number | null = null;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [animated]);

  const width = 300;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...data, 1);
  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * chartWidth,
    y: padding + chartHeight - (val / maxVal) * chartHeight,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  const gradientId = `chartGrad-${color.replace('#', '')}`;
  const clipId = `chartClip-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={width * progress} height={height} />
        </clipPath>
      </defs>

      {/* Area fill */}
      {showArea && (
        <path
          d={areaD}
          fill={`url(#${gradientId})`}
          clipPath={`url(#${clipId})`}
        />
      )}

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        clipPath={`url(#${clipId})`}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />

      {/* Dots */}
      {showDots && points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={progress > i / data.length ? 4 : 0}
          fill={color}
          style={{
            transition: 'r 0.3s ease',
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
      ))}
    </svg>
  );
};

export default AnimatedLineChart;
