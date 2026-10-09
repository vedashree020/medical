export default function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && <Icon className="text-slate-300" size={40} />}
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {message && <p className="max-w-sm text-xs text-slate-400">{message}</p>}
    </div>
  );
}
