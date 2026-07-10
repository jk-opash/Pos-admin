import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  'bg-indigo-50/80 text-indigo-700 border-indigo-200 shadow-inset-white',
  success:  'bg-emerald-50/80 text-emerald-700 border-emerald-200 shadow-inset-white',
  warning:  'bg-amber-50/80 text-amber-700 border-amber-200 shadow-inset-white',
  danger:   'bg-red-50/80 text-red-700 border-red-200 shadow-inset-white',
  info:     'bg-blue-50/80 text-blue-700 border-blue-200 shadow-inset-white',
  purple:   'bg-violet-50/80 text-violet-700 border-violet-200 shadow-inset-white',
  muted:    'bg-slate-50/80 text-slate-700 border-slate-200 shadow-inset-white',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-brand-primaryDark',
  success: 'bg-brand-success',
  warning: 'bg-brand-warning',
  danger:  'bg-brand-danger',
  info:    'bg-brand-info',
  purple:  'bg-brand-purple',
  muted:   'bg-brand-placeholder',
};

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
