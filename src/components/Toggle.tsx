import { cn } from '../utils/cn';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export function Toggle({ enabled, onChange, className }: ToggleProps) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full',
        enabled ? 'bg-[#003B44]' : 'bg-gray-200',
        className
      )}
      onClick={() => onChange(!enabled)}
    >
      <span className="sr-only">Toggle billing period</span>
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}