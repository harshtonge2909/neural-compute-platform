import React from 'react';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
  color?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose';
  size?: number;
  sublabel?: string;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  min = 0,
  max = 100,
  label,
  unit = '%',
  color = 'blue',
  size = 140,
  sublabel,
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72;
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  const colorStyles = {
    cyan: { stroke: '#0B8FB3' },
    blue: { stroke: '#2563EB' },
    emerald: { stroke: '#059669' },
    amber: { stroke: '#D97706' },
    rose: { stroke: '#DC2626' },
  }[color];

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-[#D9E2EC] shadow-xs relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.85 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-130">
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active Fill Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colorStyles.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.4s ease-out',
            }}
          />
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="flex items-baseline font-mono-tech">
            <span className="text-xl font-bold text-[#172033]">{value}</span>
            {unit && <span className="text-xs text-[#526174] ml-0.5">{unit}</span>}
          </div>
          {sublabel && <span className="text-[10px] font-sans text-[#718096]">{sublabel}</span>}
        </div>
      </div>

      {/* Label */}
      <span className="text-xs font-semibold text-[#172033] font-sans text-center mt-1">
        {label}
      </span>
      <div className="flex justify-between w-full text-[10px] font-mono-tech text-[#718096] px-3 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
