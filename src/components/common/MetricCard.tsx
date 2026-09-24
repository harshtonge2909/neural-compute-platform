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
    isPositive?: boolean;
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
  isSimulated = true,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg p-4 border border-[#D9E2EC] shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div className="text-blue-600">{icon}</div>}
          <span className="text-xs font-semibold text-[#526174] font-sans">
            {title}
          </span>
        </div>

        {isSimulated && (
          <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            Simulated
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl lg:text-3xl font-bold font-mono-tech text-[#172033] tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono-tech text-[#526174]">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
        {subtitle && (
          <span className="text-[#718096] text-[11px] truncate max-w-[70%] font-sans">
            {subtitle}
          </span>
        )}

        {trend && (
          <div
            className={`flex items-center gap-0.5 font-mono-tech text-[11px] ml-auto font-medium ${
              trend.direction === 'neutral'
                ? 'text-slate-500'
                : trend.isPositive
                ? 'text-emerald-600'
                : 'text-rose-600'
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
