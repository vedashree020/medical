import { cn } from '@/utils/cn';

const sizes = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export default function ProgressBar({ value, size = 'md', className }) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-slate-200', sizes[size], className)}>
      <div
        className="h-full rounded-full bg-teal-600 transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
