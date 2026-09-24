import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'green' | 'blue' | 'cyan' | 'amber' | 'red' | 'gray';
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
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      dot: 'bg-emerald-600',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      dot: 'bg-blue-600',
    },
    cyan: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-700',
      dot: 'bg-sky-600',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    red: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      dot: 'bg-rose-600',
    },
    gray: {
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      text: 'text-slate-600',
      dot: 'bg-slate-400',
    },
  }[variant];

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-sans font-medium rounded border ${variantStyles.bg} ${variantStyles.border} ${variantStyles.text} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variantStyles.dot}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${variantStyles.dot}`}
        />
      </span>
      {label && <span className="text-slate-500 font-sans text-[11px] mr-0.5">{label}:</span>}
      <span className="tracking-wide font-mono-tech uppercase font-semibold text-[11px]">{status}</span>
    </div>
  );
};
