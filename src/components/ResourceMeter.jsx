export default function ResourceMeter({ icon: Icon, label, current, max, color = 'bg-cyan-400' }) {
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  
  // Determine color based on percentage
  let barColor = color;
  let isLow = false;
  if (pct < 30) {
    barColor = 'bg-rose-500';
    isLow = true;
  } else if (pct < 60) {
    barColor = 'bg-amber-400';
  }

  return (
    <div className={`glass rounded-2xl p-3.5 transition-all duration-300 hover:border-cyan-400/30 ${
      isLow ? 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : ''
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            isLow ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-cyan-400/10 text-cyan-400'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-white">{label}</span>
        </div>
        <div className="text-xs font-mono font-bold text-slate-300 tabular-nums">
          {Math.round(current)} / {Math.round(max)}
        </div>
      </div>
      <div className="h-2.5 bg-space-800 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}
