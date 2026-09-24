import React from 'react';

interface GaugeProps {
  value: number;        // current value
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
  color = 'cyan',
  size = 140,
  sublabel,
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  // 240 degree arc gauge
  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72; // 260 degrees arc
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  const colorStyles = {
    cyan: { stroke: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)', text: 'text-cyan-400' },
    blue: { stroke: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', text: 'text-sky-400' },
    emerald: { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400' },
    amber: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400' },
    rose: { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', text: 'text-rose-400' },
  }[color];

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.85 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-130">
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1e293b"
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
              transition: 'stroke-dashoffset 0.5s ease-out',
              filter: `drop-shadow(0 0 6px ${colorStyles.glow})`,
            }}
          />
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="flex items-baseline font-mono-tech">
            <span className="text-xl font-bold text-slate-100">{value}</span>
            {unit && <span className="text-[11px] text-slate-400 ml-0.5">{unit}</span>}
          </div>
          {sublabel && <span className="text-[9px] font-mono-tech text-slate-400 uppercase">{sublabel}</span>}
        </div>
      </div>

      {/* Label */}
      <span className="text-xs font-medium text-slate-300 uppercase tracking-wider text-center mt-1">
        {label}
      </span>
      <div className="flex justify-between w-full text-[10px] font-mono-tech text-slate-400 px-3 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
