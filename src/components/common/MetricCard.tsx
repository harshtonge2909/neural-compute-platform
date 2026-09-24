import React, { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    isPositive?: boolean; // whether "up" is good or bad (e.g. up FPS is good, up latency is bad)
  };
  subtitle?: string;
  glow?: boolean;
  accentColor?: 'cyan' | 'blue' | 'green' | 'amber' | 'purple';
  isSimulated?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  subtitle,
  glow = false,
  accentColor = 'cyan',
  isSimulated = true,
  className = '',
}) => {
  const accentBorder = {
    cyan: 'border-cyan-500/30 hover:border-cyan-500/60',
    blue: 'border-blue-500/30 hover:border-blue-500/60',
    green: 'border-emerald-500/30 hover:border-emerald-500/60',
    amber: 'border-amber-500/30 hover:border-amber-500/60',
    purple: 'border-purple-500/30 hover:border-purple-500/60',
  }[accentColor];

  const glowClass = glow
    ? accentColor === 'cyan'
      ? 'shadow-[0_0_20px_rgba(34,211,238,0.12)] border-cyan-500/50'
      : 'shadow-[0_0_20px_rgba(52,211,153,0.12)] border-emerald-500/50'
    : '';

  return (
    <div
      className={`tech-card rounded-lg p-4 relative overflow-hidden transition-all duration-200 border ${accentBorder} ${glowClass} ${className}`}
    >
      {/* Top subtle corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60" />
      </div>

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-400">{icon}</div>}
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </span>
        </div>

        {isSimulated && (
          <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
            Simulated
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl lg:text-3xl font-bold font-mono-tech text-slate-100 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono-tech text-slate-400 font-normal">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
        {subtitle && (
          <span className="text-slate-400 text-[11px] truncate max-w-[70%]">
            {subtitle}
          </span>
        )}

        {trend && (
          <div
            className={`flex items-center gap-0.5 font-mono-tech text-[11px] ml-auto ${
              trend.direction === 'neutral'
                ? 'text-slate-400'
                : trend.isPositive
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}
          >
            {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};
