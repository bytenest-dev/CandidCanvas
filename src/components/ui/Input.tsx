import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#374151] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full border border-[#E5E7EB] rounded bg-white px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF]',
              'focus:outline-none focus:ring-2 focus:ring-[#374151] focus:border-transparent transition-all',
              'disabled:bg-[#F8F9FA] disabled:cursor-not-allowed',
              error && 'border-[#EF4444] focus:ring-[#EF4444]',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-[#EF4444]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
