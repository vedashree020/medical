import { cn } from '@/utils/cn';

const variants = {
  emergency: 'bg-red-100 text-red-700 border-red-200',
  urgent: 'bg-amber-100 text-amber-700 border-amber-200',
  routine: 'bg-sky-100 text-sky-700 border-sky-200',
  confirmed: 'bg-teal-100 text-teal-700 border-teal-200',
  available: 'bg-teal-100 text-teal-700 border-teal-200',
  scheduled: 'bg-sky-100 text-sky-700 border-sky-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}
