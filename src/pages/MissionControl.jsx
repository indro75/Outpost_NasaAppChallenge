import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Droplets, Apple, Zap, Wrench, FlaskConical, SkipForward, RotateCcw } from 'lucide-react';
import { createInitialState, advanceDay } from '../game/engine.js';
import ResourceMeter from '../components/ResourceMeter.jsx';
import EventDialog from '../components/EventDialog.jsx';

export default function MissionControl() {
  const nav = useNavigate();
  const [state, setState] = useState(null);

  useEffect(() => {
    const savedMission = localStorage.getItem('activeMission');
    let settings;
    
    if (savedMission) {
      try {
        settings = JSON.parse(savedMission);
      } catch (e) {
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
    setState(createInitialState(settings));
  }, []);

  const handleNextDay = () => {
    if (state && !state.ended) {
      setState(advanceDay(state));
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

  if (!state) return <div className="text-center p-10 text-slate-400">Initializing Mission Control...</div>;

  if (state.ended) {
    localStorage.setItem('lastMission', JSON.stringify(state));
    nav('/results');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Mission Control</h1>
          <p className="text-slate-400 mt-1">Day {state.day} / {state.settings.duration} · Crew Wellbeing: {Math.round(state.crew.wellbeing)}%</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleNextDay} className="px-5 py-2.5 rounded-lg bg-cyan-400 text-space-900 font-bold hover:bg-cyan-300 inline-flex items-center gap-2">
            <SkipForward className="w-4 h-4" /> Next Day
          </button>
          <button onClick={handleRestart} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="h-2 bg-space-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${(state.day / state.settings.duration) * 100}%` }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ResourceMeter icon={Wind} label="Oxygen" current={state.resources.oxygen.current} max={state.resources.oxygen.max} />
        <ResourceMeter icon={Droplets} label="Water" current={state.resources.water.current} max={state.resources.water.max} />
        <ResourceMeter icon={Apple} label="Food" current={state.resources.food.current} max={state.resources.food.max} />
        <ResourceMeter icon={Zap} label="Electricity" current={state.resources.electricity.current} max={state.resources.electricity.max} />
        <ResourceMeter icon={Wrench} label="Spare Parts" current={state.resources.spareParts.current} max={state.resources.spareParts.max} />
        <ResourceMeter icon={FlaskConical} label="Research" current={state.resources.research.current} max={100} />
      </div>

      {state.alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-rose-400">Active Alerts</h3>
          {state.alerts.slice(-3).map(alert => (
            <div key={alert.id} className="glass rounded-lg p-3 border-l-4 border-rose-500 text-sm text-slate-200">
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {state.pendingEvent && <EventDialog event={state.pendingEvent} onChoose={handleEventChoice} />}
    </div>
  );
}