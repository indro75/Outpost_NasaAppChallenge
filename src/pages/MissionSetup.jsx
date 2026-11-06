import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Moon, Globe, Users, Calendar, Target } from 'lucide-react';
import { DESTINATIONS, DIFFICULTIES, OBJECTIVES } from '../game/missions.js';

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5 hover:border-cyan-400/20 transition-all duration-200">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="font-bold text-white text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 ${
        active
          ? 'bg-cyan-400 text-space-900 border-cyan-400 shadow-glow font-bold scale-[1.02]'
          : 'bg-space-700/80 border-white/10 text-slate-300 hover:bg-space-600 hover:text-white hover:border-white/20'
      }`}
    >
      {children}
    </button>
  );
}

export default function MissionSetup() {
  const nav = useNavigate();
  const [destination, setDestination] = useState('moon');
  const [difficulty, setDifficulty] = useState('explorer');
  const [crewSize, setCrewSize] = useState(4);
  const [duration, setDuration] = useState(14);
  const [objective, setObjective] = useState('habitat');

  const handleLaunch = () => {
    const settings = { destination, difficulty, crewSize, duration, objective };
    // Save settings so other pages can use them
    localStorage.setItem('missionSettings', JSON.stringify(settings));
    nav('/build');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white">Mission Setup</h1>
        <p className="text-slate-400 mt-1">Configure your mission before launch.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Destination" icon={Globe}>
          <div className="flex gap-2.5">
            <Pill active={destination === 'moon'} onClick={() => setDestination(DESTINATIONS.moon.id)}>
              <span className="inline-flex items-center gap-2"><Moon className="w-4 h-4"/> Moon</span>
            </Pill>
            <Pill active={destination === 'mars'} onClick={() => setDestination(DESTINATIONS.mars.id)}>
              <span className="inline-flex items-center gap-2"><Globe className="w-4 h-4"/> Mars</span>
            </Pill>
          </div>
        </Section>

        <Section title="Difficulty" icon={Target}>
          <div className="flex flex-wrap gap-2.5">
            {Object.values(DIFFICULTIES).map(d => (
              <Pill key={d.id} active={difficulty === d.id} onClick={() => setDifficulty(d.id)}>
                {d.label}
              </Pill>
            ))}
          </div>
        </Section>

        <Section title="Crew Size" icon={Users}>
          <div className="flex gap-2.5">
            {[2, 4, 6].map(n => (
              <Pill key={n} active={crewSize === n} onClick={() => setCrewSize(n)}>{n} astronauts</Pill>
            ))}
          </div>
        </Section>

        <Section title="Duration" icon={Calendar}>
          <div className="flex gap-2.5">
            {[7, 14, 30].map(n => (
              <Pill key={n} active={duration === n} onClick={() => setDuration(n)}>{n} days</Pill>
            ))}
          </div>
        </Section>

        <Section title="Objective" icon={Target}>
          <div className="flex flex-wrap gap-2.5">
            {Object.values(OBJECTIVES).map(o => (
              <Pill key={o.id} active={objective === o.id} onClick={() => setObjective(o.id)}>{o.label}</Pill>
            ))}
          </div>
        </Section>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => nav('/')}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-semibold transition"
        >
          Cancel
        </button>
        <button
          onClick={handleLaunch}
          className="px-7 py-3 rounded-xl bg-cyan-400 text-space-900 font-extrabold hover:bg-cyan-300 shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Rocket className="w-4 h-4" /> Launch Mission
        </button>
      </div>
    </div>
  );
}
