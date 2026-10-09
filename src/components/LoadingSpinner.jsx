import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label, sublabel }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="animate-spin text-teal-600" size={32} />
      {label && <p className="text-sm font-medium text-slate-600">{label}</p>}
      {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
    </div>
  );
}
