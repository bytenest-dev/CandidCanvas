import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed tracking-wide';

    const variants = {
      primary: 'bg-[#111827] text-white hover:bg-[#374151] focus:ring-[#374151]',
      secondary: 'bg-[#F8F9FA] text-[#111827] border border-[#E5E7EB] hover:bg-[#E5E7EB] focus:ring-[#374151]',
      outline: 'border border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white focus:ring-[#374151]',
      ghost: 'text-[#111827] hover:bg-[#F8F9FA] focus:ring-[#374151]',
      danger: 'bg-[#EF4444] text-white hover:bg-red-600 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs rounded',
      md: 'px-6 py-3 text-sm rounded',
      lg: 'px-8 py-4 text-base rounded',
      xl: 'px-12 py-5 text-lg rounded',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
