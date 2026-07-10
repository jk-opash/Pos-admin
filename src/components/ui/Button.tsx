'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-brand-primary to-brand-purple text-white hover:from-brand-primaryDark hover:to-violet-600 shadow-primary hover:shadow-primary-hover border-transparent',
  secondary: 'bg-white text-brand-dark hover:bg-brand-light border border-brand-border shadow-sm hover:shadow-[0_4px_14px_0_rgba(0,0,0,0.05)]',
  outline: 'bg-transparent text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/5 hover:border-brand-primary/40',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-brand-dark border border-transparent',
  danger: 'bg-gradient-to-r from-red-500 to-brand-danger text-white shadow-danger hover:shadow-danger-hover border-transparent',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 flex items-center justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/50 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
