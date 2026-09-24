import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'green' | 'blue' | 'cyan' | 'amber' | 'red' | 'purple' | 'gray';
  pulse?: boolean;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'green',
  pulse = false,
  label,
  className = '',
  size = 'md',
}) => {
  const variantStyles = {
    green: {
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.4)]',
    },
    blue: {
      bg: 'bg-blue-950/60',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      dot: 'bg-blue-400',
      glow: 'shadow-[0_0_8px_rgba(96,165,250,0.4)]',
    },
    cyan: {
      bg: 'bg-cyan-950/60',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      dot: 'bg-cyan-400',
      glow: 'shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    },
    amber: {
      bg: 'bg-amber-950/60',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_8px_rgba(251,191,36,0.4)]',
    },
    red: {
      bg: 'bg-rose-950/60',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      dot: 'bg-rose-400',
      glow: 'shadow-[0_0_8px_rgba(244,63,94,0.4)]',
    },
    purple: {
      bg: 'bg-purple-950/60',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      dot: 'bg-purple-400',
      glow: 'shadow-[0_0_8px_rgba(192,132,252,0.4)]',
    },
    gray: {
      bg: 'bg-slate-900/70',
      border: 'border-slate-700/50',
      text: 'text-slate-400',
      dot: 'bg-slate-400',
      glow: '',
    },
  }[variant];

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono-tech font-medium rounded border ${variantStyles.bg} ${variantStyles.border} ${variantStyles.text} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variantStyles.dot}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${variantStyles.dot} ${variantStyles.glow}`}
        />
      </span>
      {label && <span className="text-slate-400 font-sans text-[11px] uppercase mr-0.5">{label}:</span>}
      <span className="tracking-wide uppercase">{status}</span>
    </div>
  );
};
