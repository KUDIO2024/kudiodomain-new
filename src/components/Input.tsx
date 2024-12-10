import { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, disabled, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className={cn(
        "block text-sm font-medium",
        disabled ? "text-gray-400" : "text-gray-700"
      )}>
        {label}
      </label>
      <div className="relative">
        <input
          className={cn(
            'w-full px-3 py-2 h-[42px] border rounded-lg transition-colors',
            'focus:ring-2 focus:ring-[#003B44] focus:border-[#003B44]',
            error && 'border-red-500',
            disabled && 'bg-gray-100 cursor-not-allowed',
            props.type === 'search' && 'pr-14',
            className
          )}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}