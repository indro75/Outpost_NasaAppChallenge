import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUILDING_LIST, BUILDINGS } from '../game/buildings.js';
import BuildingCard from '../components/BuildingCard.jsx';
import * as Icons from 'lucide-react';

export default function BaseBuilder() {
  const nav = useNavigate();
  const [cargoRemaining, setCargoRemaining] = useState(140);
  const [placedBuildings, setPlacedBuildings] = useState([]);

  const handleBuild = (buildingId) => {
    const building = BUILDINGS[buildingId];
    if (cargoRemaining >= building.cost) {
      setCargoRemaining(prev => prev - building.cost);
      setPlacedBuildings(prev => [...prev, { ...building, instanceId: Date.now() }]);
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
          <h1 className="text-3xl font-bold">Base Builder</h1>
          <p className="text-slate-400 mt-1">
            Cargo remaining: <b className="text-cyan-400">{cargoRemaining}</b>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>nav('/setup')} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
            Back
          </button>
          <button 
            onClick={handleBeginMission} 
            disabled={placedBuildings.length === 0}
            className="px-5 py-2 rounded-lg bg-cyan-400 text-space-900 font-bold hover:bg-cyan-300 disabled:bg-slate-600 disabled:text-slate-400"
          >
            Begin Mission
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Your Outpost</h3>
        <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-b from-space-800 to-space-900 border border-white/5">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-700/60 to-transparent" />
          
          <div className="absolute inset-0 p-4 grid grid-cols-6 md:grid-cols-8 gap-2 content-start">
            {placedBuildings.map(inst => {
              const Icon = Icons[inst.icon] || Icons.Box;
              return (
                <div key={inst.instanceId} className="group relative aspect-square rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center hover:bg-cyan-400/20 transition">
                  <Icon className="w-5 h-5 text-cyan-300" />
                  <button
                    onClick={()=>handleRemove(inst.instanceId)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-bold"
                  >
                    X
                  </button>
                  <div className="absolute bottom-0 inset-x-0 text-[9px] text-center text-slate-300 truncate px-1 bg-space-900/50">
                    {inst.name}
                  </div>
                </div>
              );
            })}
            {placedBuildings.length === 0 && (
              <div className="col-span-full text-center text-slate-500 text-sm mt-10">
                No buildings yet. Choose from the catalog below.
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Building Catalog</h3>
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