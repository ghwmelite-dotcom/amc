import React from 'react';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showLabels = true,
  showValues = true,
  horizontal = false,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const defaultColors = ['#00D4AA', '#0066FF', '#667EEA', '#FF6B35', '#FFD93D', '#00D26A'];

  if (horizontal) {
    return (
      <div className="w-full space-y-3">
        {data.map((item, index) => {
          const color = item.color || defaultColors[index % defaultColors.length];
          const percentage = (item.value / maxValue) * 100;

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                {showLabels && <span className="text-white/70">{item.label}</span>}
                {showValues && <span className="text-white font-medium">{item.value}</span>}
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}AA)`,
                    boxShadow: `0 0 10px ${color}50`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, index) => {
        const color = item.color || defaultColors[index % defaultColors.length];
        const percentage = (item.value / maxValue) * 100;

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center justify-end" style={{ height: height - 40 }}>
              {showValues && (
                <span className="text-xs text-white/70 mb-1">{item.value}</span>
              )}
              <div
                className="w-full max-w-[40px] rounded-t-lg transition-all duration-1000 ease-out"
                style={{
                  height: `${percentage}%`,
                  minHeight: '4px',
                  background: `linear-gradient(180deg, ${color}, ${color}80)`,
                  boxShadow: `0 0 10px ${color}40`,
                }}
              />
            </div>
            {showLabels && (
              <span className="text-xs text-white/50 truncate max-w-full">{item.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;
