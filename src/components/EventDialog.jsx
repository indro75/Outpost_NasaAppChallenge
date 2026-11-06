import { AlertTriangle, Info, Zap } from 'lucide-react';

const severityStyles = {
  info: { bg: 'bg-cyan-400/10', border: 'border-cyan-400/30', icon: Info, color: 'text-cyan-400' },
  warning: { bg: 'bg-amber-400/10', border: 'border-amber-400/30', icon: AlertTriangle, color: 'text-amber-400' },
  critical: { bg: 'bg-rose-400/10', border: 'border-rose-400/30', icon: Zap, color: 'text-rose-400' }
};

export default function EventDialog({ event, onChoose }) {
  if (!event) return null;
  const s = severityStyles[event.severity] || severityStyles.info;
  const Icon = s.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className={`glass rounded-3xl max-w-lg w-full p-6 md:p-8 border ${s.border} shadow-2xl transition-all animate-fadeIn`}>
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-12 h-12 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0 animate-bounce`}>
            <Icon className={`w-6 h-6 ${s.color}`} />
          </div>
          <div>
            <div className={`text-xs uppercase tracking-widest ${s.color} font-bold`}>{event.severity}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white">{event.title}</h2>
          </div>
        </div>
        
        <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-6 bg-space-800/60 p-4 rounded-2xl border border-white/5">{event.description}</p>
        
        <div className="space-y-2.5">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoose(i)}
              className="w-full text-left px-4 py-3.5 rounded-xl bg-space-700/80 hover:bg-space-600 border border-white/10 hover:border-cyan-400/50 hover:translate-x-1 active:scale-98 transition-all duration-150 text-sm font-semibold text-white shadow-sm flex items-center justify-between group"
            >
              <span>{choice.label}</span>
              <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
