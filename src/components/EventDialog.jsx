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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`glass rounded-2xl max-w-lg w-full p-6 border ${s.border} shadow-2xl`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg ${s.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${s.color}`} />
          </div>
          <div>
            <div className={`text-xs uppercase tracking-widest ${s.color} font-bold`}>{event.severity}</div>
            <h2 className="text-xl font-bold text-white">{event.title}</h2>
          </div>
        </div>
        
        <p className="text-slate-200 mb-6">{event.description}</p>
        
        <div className="space-y-3">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoose(i)}
              className="w-full text-left px-4 py-3 rounded-lg bg-space-700 hover:bg-space-600 border border-white/10 transition text-sm font-medium"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}