import * as Icons from 'lucide-react';

export default function BuildingCard({ building, onBuild, disabled }) {
  // Map string icon names to actual Lucide components
  const Icon = Icons[building.icon] || Icons.Box;

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{building.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{building.description}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-slate-300 mt-2">
        <div>Cargo: <span className="text-cyan-400 font-bold">{building.cost}</span></div>
        <div>Power: <span className={building.power >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
          {building.power > 0 ? `+${building.power}` : building.power}
        </span></div>
      </div>

      <button
        onClick={() => onBuild(building.id)}
        disabled={disabled}
        className="mt-2 px-3 py-2 rounded-lg bg-cyan-400 text-space-900 font-bold text-sm hover:bg-cyan-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition"
      >
        Build
      </button>
    </div>
  );
}