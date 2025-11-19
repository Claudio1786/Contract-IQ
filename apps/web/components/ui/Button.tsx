import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--primary-600)] text-[var(--text-primary)] hover:bg-[var(--primary-700)] focus-visible:ring-[var(--primary-600)]',
        secondary:
          'border border-[color:var(--border-default)] bg-white text-[var(--color-text-inverse)] hover:bg-gray-50 focus-visible:ring-[var(--gray-600)]',
        ghost:
          'text-[var(--color-text-tertiary)] hover:bg-[var(--border-subtle)] hover:text-[var(--color-text-primary)]',
        danger:
          'bg-[var(--danger-600)] text-[var(--text-primary)] hover:bg-[var(--danger-700)] focus-visible:ring-[var(--danger-600)]',
        success:
          'bg-[var(--success-600)] text-[var(--text-primary)] hover:bg-[var(--success-700)] focus-visible:ring-[var(--success-600)]'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-6 text-base',
        xl: 'h-12 px-8 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };