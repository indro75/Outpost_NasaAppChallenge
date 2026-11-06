import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, BookOpen, AlertTriangle } from 'lucide-react';

export default function Results() {
  const nav = useNavigate();
  const [mission] = useState(() => {
    const saved = localStorage.getItem('lastMission');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  if (!mission) {
    return (
      <div className="text-center p-12 text-slate-400 space-y-4">
        <p>No completed mission data found.</p>
        <button
          onClick={() => nav('/')}
          className="px-6 py-2.5 rounded-xl bg-cyan-400 text-space-900 font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const success = mission.endReason === 'complete';
  
  // Simple scoring algorithm
  const score = Math.round(
    (mission.day * 10) + 
    (mission.crew.wellbeing * 2) + 
    (mission.resources.research.current * 5)
  );

  const handleRetry = () => {
    localStorage.removeItem('lastMission');
    nav('/setup');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="glass rounded-3xl p-8 md:p-12 text-center glow-border border border-cyan-400/30 shadow-2xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-400 flex items-center justify-center mx-auto mb-4 shadow-glow animate-bounce">
          {success ? <Trophy className="w-10 h-10 text-space-900" /> : <AlertTriangle className="w-10 h-10 text-space-900" />}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white">Mission {success ? 'Complete' : 'Ended'}</h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto leading-relaxed">
          {success 
            ? `Congratulations Commander! You survived ${mission.day} days.` 
            : 'The mission was aborted due to critical crew conditions.'}
        </p>
        
        <div className="mt-8 text-6xl md:text-7xl font-extrabold text-cyan-400 tabular-nums drop-shadow-[0_0_20px_rgba(85,214,255,0.4)]">
          {score} <span className="text-xl text-slate-400 font-normal">pts</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 text-center border border-white/5 hover:border-cyan-400/20 transition">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Days Survived</div>
          <div className="text-3xl font-extrabold text-white mt-1 font-mono">{mission.day}</div>
        </div>
        <div className="glass rounded-2xl p-5 text-center border border-white/5 hover:border-cyan-400/20 transition">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Crew Wellbeing</div>
          <div className={`text-3xl font-extrabold mt-1 font-mono ${
            mission.crew.wellbeing < 50 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {Math.round(mission.crew.wellbeing)}%
          </div>
        </div>
        <div className="glass rounded-2xl p-5 text-center border border-white/5 hover:border-cyan-400/20 transition">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Research Points</div>
          <div className="text-3xl font-extrabold text-cyan-300 mt-1 font-mono">{Math.round(mission.resources.research.current)}</div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold text-lg mb-3 text-white">Commander's Debrief</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {mission.resources.oxygen.current <= 10 && <li>• Oxygen reserves were critically low. Consider building more Oxygen Generators.</li>}
          {mission.resources.water.current <= 10 && <li>• Water supplies ran low. A Water Recycler is essential for long missions.</li>}
          {mission.crew.wellbeing < 50 && <li>• Crew morale suffered. Ensure you have enough Food and power for the Habitat.</li>}
          {mission.resources.research.current > 20 && <li>• Excellent scientific output! The Science Laboratory paid off.</li>}
          {success && mission.crew.wellbeing > 80 && <li>• Outstanding leadership. Your crew is healthy and the mission is a success.</li>}
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          onClick={handleRetry}
          className="px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-extrabold hover:bg-cyan-300 shadow-glow hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> New Mission
        </button>
        <button
          onClick={() => nav('/science')}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-slate-200 hover:text-white transition-all inline-flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-violet-400" /> Science Library
        </button>
        <button
          onClick={() => nav('/')}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-slate-200 hover:text-white transition-all inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4 text-cyan-400" /> Home
        </button>
      </div>
    </div>
  );
}
