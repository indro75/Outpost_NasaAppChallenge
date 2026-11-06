import * as Icons from 'lucide-react';

export default function BuildingCard({ building, onBuild, disabled }) {
  // Map string icon names to actual Lucide components
  const Icon = Icons[building.icon] || Icons.Box;

  return (
    <div className="glass rounded-2xl p-4 flex flex-col justify-between gap-3 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-glow transition-all duration-200 group">
      <div>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">{building.name}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{building.description}</p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center text-xs text-slate-300 font-mono py-2 border-t border-white/5">
          <div>Cargo: <span className="text-cyan-400 font-bold">{building.cost}</span></div>
          <div>Power: <span className={`font-bold ${building.power >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {building.power > 0 ? `+${building.power}` : building.power}
          </span></div>
        </div>

        <button
          onClick={() => onBuild(building.id)}
          disabled={disabled}
          className="w-full mt-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-space-900 font-extrabold text-sm hover:bg-cyan-300 hover:shadow-glow active:scale-95 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-150"
        >
          Build
        </button>
      </div>
    </div>
  );
}
