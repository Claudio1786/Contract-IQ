import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full rounded-md border border-[color:var(--border-default)] bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:border-[var(--primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-[color:var(--danger-500)] focus:border-[var(--danger-600)] focus:ring-[var(--danger-600)]',
        success: 'border-[color:var(--success-500)] focus:border-[var(--success-600)] focus:ring-[var(--success-600)]'
      },
      size: {
        sm: 'h-8 px-2 py-1 text-xs',
        md: 'h-9 px-3 py-2 text-sm',
        lg: 'h-10 px-4 py-2 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, helperText, errorText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!errorText;
    const finalVariant = hasError ? 'error' : variant;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text-inverse)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            className={inputVariants({ 
              variant: finalVariant, 
              size, 
              className: `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}` 
            })}
            ref={ref}
            id={inputId}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {(errorText || helperText) && (
          <p className={`mt-1 text-xs ${hasError ? 'text-[var(--danger-600)]' : 'text-gray-500'}`}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };