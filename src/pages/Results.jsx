import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, BookOpen } from 'lucide-react';

export default function Results() {
  const nav = useNavigate();
  const [mission, setMission] = useState(null);

  useEffect(() => {
    // Read the final state from localStorage
    const saved = localStorage.getItem('lastMission');
    if (saved) {
      setMission(JSON.parse(saved));
    } else {
      nav('/'); // Go home if no data
    }
  }, [nav]);

  if (!mission) return <div className="text-center p-10">Loading Results...</div>;

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass rounded-2xl p-8 text-center glow-border">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-violet-400 flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Trophy className="w-8 h-8 text-space-900" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Mission {success ? 'Complete' : 'Ended'}</h1>
        <p className="text-xl text-slate-300">
          {success 
            ? `Congratulations Commander! You survived ${mission.day} days.` 
            : 'The mission was aborted due to critical crew conditions.'}
        </p>
        
        <div className="mt-8 text-6xl font-bold text-cyan-400 tabular-nums">
          {score} <span className="text-lg text-slate-400 font-normal">pts</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Days Survived</div>
          <div className="text-2xl font-bold text-white mt-1">{mission.day}</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Crew Wellbeing</div>
          <div className="text-2xl font-bold text-white mt-1">{Math.round(mission.crew.wellbeing)}%</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Research Points</div>
          <div className="text-2xl font-bold text-white mt-1">{Math.round(mission.resources.research.current)}</div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-3">Commander's Debrief</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {mission.resources.oxygen.current <= 10 && <li>• Oxygen reserves were critically low. Consider building more Oxygen Generators.</li>}
          {mission.resources.water.current <= 10 && <li>• Water supplies ran low. A Water Recycler is essential for long missions.</li>}
          {mission.crew.wellbeing < 50 && <li>• Crew morale suffered. Ensure you have enough Food and power for the Habitat.</li>}
          {mission.resources.research.current > 20 && <li>• Excellent scientific output! The Science Laboratory paid off.</li>}
          {success && mission.crew.wellbeing > 80 && <li>• Outstanding leadership. Your crew is healthy and the mission is a success.</li>}
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={handleRetry} className="px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold hover:bg-cyan-300 inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> New Mission
        </button>
        <button onClick={()=>nav('/science')} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 inline-flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Science Library
        </button>
        <button onClick={()=>nav('/')} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Home
        </button>
      </div>
    </div>
  );
}