import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Droplets, Apple, Zap, Wrench, FlaskConical, SkipForward, RotateCcw, AlertCircle } from 'lucide-react';
import { createInitialState, advanceDay } from '../game/engine.js';
import ResourceMeter from '../components/ResourceMeter.jsx';
import EventDialog from '../components/EventDialog.jsx';

export default function MissionControl() {
  const nav = useNavigate();
  const [state, setState] = useState(() => {
    const savedMission = localStorage.getItem('activeMission');
    let settings;
    
    if (savedMission) {
      try {
        settings = JSON.parse(savedMission);
      } catch {
        // Fallback if data is corrupted
        settings = { crewSize: 4, duration: 14, buildings: [{ id: 'solar' }, { id: 'habitat' }] };
      }
    } else {
      // Fallback if no data exists
      settings = { 
        crewSize: 4, 
        duration: 14, 
        buildings: [{ id: 'solar' }, { id: 'solar' }, { id: 'habitat' }, { id: 'oxygen' }, { id: 'water' }] 
      };
    }
    return createInitialState(settings);
  });

  const handleNextDay = () => {
    if (state && !state.ended) {
      const next = advanceDay(state);
      if (next.ended) {
        localStorage.setItem('lastMission', JSON.stringify(next));
        nav('/results');
      } else {
        setState(next);
      }
    }
  };

  const handleRestart = () => {
    localStorage.removeItem('activeMission');
    nav('/setup');
  };

  const handleEventChoice = (choiceIndex) => {
    const event = state.pendingEvent;
    const choice = event.choices[choiceIndex];
    let newState = JSON.parse(JSON.stringify(state));
    newState.pendingEvent = null;

    if (choice.cost) {
      for (const key in choice.cost) {
        if (newState.resources[key]) newState.resources[key].current -= choice.cost[key];
      }
    }
    if (choice.effect) {
      for (const key in choice.effect) {
        if (newState.resources[key]) newState.resources[key].current += choice.effect[key];
        else if (key === 'wellbeing') newState.crew.wellbeing += choice.effect[key];
      }
    }

    newState.crew.wellbeing = Math.max(0, Math.min(100, newState.crew.wellbeing));
    for (const key in newState.resources) {
      newState.resources[key].current = Math.max(0, newState.resources[key].current);
    }
    newState.alerts = [...newState.alerts, { id: Date.now(), severity: 'info', message: choice.outcome }];
    setState(newState);
  };

  if (!state) return <div className="text-center p-12 text-slate-400 animate-pulse">Initializing Mission Control...</div>;

  const wellbeingPct = Math.round(state.crew.wellbeing);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4 glass rounded-3xl p-5 border border-cyan-400/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Mission Control</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-bold font-mono border ${
              wellbeingPct < 40
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : wellbeingPct < 70
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
            }`}>
              Wellbeing: {wellbeingPct}%
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Day <b className="text-cyan-400 font-mono text-base">{state.day}</b> of {state.settings.duration} · Crew Size: {state.crew.size} astronauts
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRestart}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs md:text-sm transition flex items-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
          <button
            onClick={handleNextDay}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 text-space-900 font-extrabold text-xs md:text-sm hover:bg-cyan-300 shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" /> Next Day
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 border border-white/5 space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Mission Progress</span>
          <span className="font-mono text-cyan-300">{Math.round((state.day / state.settings.duration) * 100)}%</span>
        </div>
        <div className="h-2.5 bg-space-800 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 transition-all duration-500"
            style={{ width: `${(state.day / state.settings.duration) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <ResourceMeter icon={Wind} label="Oxygen" current={state.resources.oxygen.current} max={state.resources.oxygen.max} />
        <ResourceMeter icon={Droplets} label="Water" current={state.resources.water.current} max={state.resources.water.max} />
        <ResourceMeter icon={Apple} label="Food" current={state.resources.food.current} max={state.resources.food.max} />
        <ResourceMeter icon={Zap} label="Electricity" current={state.resources.electricity.current} max={state.resources.electricity.max} />
        <ResourceMeter icon={Wrench} label="Spare Parts" current={state.resources.spareParts.current} max={state.resources.spareParts.max} />
        <ResourceMeter icon={FlaskConical} label="Research" current={state.resources.research.current} max={100} />
      </div>

      {state.alerts.length > 0 && (
        <div className="space-y-2 glass rounded-2xl p-4 border border-white/5">
          <h3 className="font-bold text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Active Alerts
          </h3>
          <div className="space-y-1.5">
            {state.alerts.slice(-3).map(alert => (
              <div
                key={alert.id}
                className="rounded-xl p-3 bg-space-800/80 border-l-4 border-rose-500 text-xs md:text-sm text-slate-200 shadow-sm"
              >
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {state.pendingEvent && <EventDialog event={state.pendingEvent} onChoose={handleEventChoice} />}
    </div>
  );
}
