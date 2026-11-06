import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUILDING_LIST, BUILDINGS } from '../game/buildings.js';
import BuildingCard from '../components/BuildingCard.jsx';
import * as Icons from 'lucide-react';
import { Rocket, ArrowLeft } from 'lucide-react';

export default function BaseBuilder() {
  const nav = useNavigate();
  const [cargoRemaining, setCargoRemaining] = useState(140);
  const [placedBuildings, setPlacedBuildings] = useState([]);

  const handleBuild = (buildingId) => {
    const building = BUILDINGS[buildingId];
    if (cargoRemaining >= building.cost) {
      setCargoRemaining(prev => prev - building.cost);
      setPlacedBuildings(prev => [...prev, { ...building, instanceId: Date.now() + Math.random() }]);
    }
  };

  const handleRemove = (instanceId) => {
    const buildingToRemove = placedBuildings.find(b => b.instanceId === instanceId);
    if (buildingToRemove) {
      setCargoRemaining(prev => prev + buildingToRemove.cost);
      setPlacedBuildings(prev => prev.filter(b => b.instanceId !== instanceId));
    }
  };

  const handleBeginMission = () => {
    // SAFE PARSING: If settings are missing, use defaults
    const savedSettings = localStorage.getItem('missionSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : { crewSize: 4, duration: 14, destination: 'moon' };
    
    const missionState = {
      ...settings,
      buildings: placedBuildings.map(b => ({ id: b.id })) 
    };
    localStorage.setItem('activeMission', JSON.stringify(missionState));
    nav('/mission');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Base Builder</h1>
          <p className="text-slate-400 mt-1">
            Cargo remaining: <b className="text-cyan-400 font-mono text-lg">{cargoRemaining}</b>
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => nav('/setup')}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-semibold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button 
            onClick={handleBeginMission} 
            disabled={placedBuildings.length === 0}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 text-space-900 font-extrabold hover:bg-cyan-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed shadow-glow transition-all active:scale-95 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" /> Begin Mission
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-5 border border-cyan-400/20 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-base">Your Outpost</h3>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
            {placedBuildings.length} Modules Placed
          </span>
        </div>
        <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-space-800 to-space-900 border border-white/10 shadow-inner">
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-700/60 to-transparent pointer-events-none" />
          
          <div className="absolute inset-0 p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 content-start overflow-y-auto">
            {placedBuildings.map(inst => {
              const Icon = Icons[inst.icon] || Icons.Box;
              return (
                <div
                  key={inst.instanceId}
                  className="group relative aspect-square rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex flex-col items-center justify-center hover:bg-cyan-400/20 hover:scale-105 transition-all duration-200 shadow-sm animate-fadeIn"
                >
                  <Icon className="w-6 h-6 text-cyan-300 group-hover:rotate-6 transition-transform" />
                  <button
                    onClick={() => handleRemove(inst.instanceId)}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs font-bold shadow-md hover:scale-110"
                    title="Remove building"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 inset-x-0 text-[10px] font-semibold text-center text-slate-200 truncate px-1 py-0.5 bg-space-900/80 rounded-b-xl">
                    {inst.name}
                  </div>
                </div>
              );
            })}
            {placedBuildings.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center h-48 text-slate-400 text-sm">
                <p>No buildings yet. Choose from the catalog below.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-white text-lg mb-3">Building Catalog</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUILDING_LIST.map(b => (
            <BuildingCard
              key={b.id}
              building={b}
              onBuild={handleBuild}
              disabled={cargoRemaining < b.cost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
