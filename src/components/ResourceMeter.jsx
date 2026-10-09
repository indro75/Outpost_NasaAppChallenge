export default function ResourceMeter({ icon: Icon, label, current, max, color = 'bg-cyan-400' }) {
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  
  // Determine color based on percentage
  let barColor = color;
  if (pct < 30) barColor = 'bg-rose-500';
  else if (pct < 60) barColor = 'bg-amber-400';

  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon className="w-4 h-4 text-cyan-400" />
          <span>{label}</span>
        </div>
        <div className="text-xs text-slate-300 tabular-nums">
          {Math.round(current)} / {Math.round(max)}
        </div>
      </div>
      <div className="h-2 bg-space-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}