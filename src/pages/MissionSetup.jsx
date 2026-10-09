import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Moon, Globe, Users, Calendar, Target } from 'lucide-react';
import { DESTINATIONS, DIFFICULTIES, OBJECTIVES } from '../game/missions.js';

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

  const Section = ({ title, icon: Icon, children }) => (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-cyan-400" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Pill = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
        active ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300' : 'bg-space-700 border-white/5 text-slate-300 hover:bg-space-600'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mission Setup</h1>
        <p className="text-slate-400 mt-1">Configure your mission before launch.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Destination" icon={Globe}>
          <div className="flex gap-2">
            <Pill active={destination==='moon'} onClick={()=>setDestination('moon')}>
              <span className="inline-flex items-center gap-2"><Moon className="w-4 h-4"/> Moon</span>
            </Pill>
            <Pill active={destination==='mars'} onClick={()=>setDestination('mars')}>
              <span className="inline-flex items-center gap-2"><Globe className="w-4 h-4"/> Mars</span>
            </Pill>
          </div>
        </Section>

        <Section title="Difficulty" icon={Target}>
          <div className="flex flex-wrap gap-2">
            {Object.values(DIFFICULTIES).map(d => (
              <Pill key={d.id} active={difficulty===d.id} onClick={()=>setDifficulty(d.id)}>
                {d.label}
              </Pill>
            ))}
          </div>
        </Section>

        <Section title="Crew Size" icon={Users}>
          <div className="flex gap-2">
            {[2,4,6].map(n => (
              <Pill key={n} active={crewSize===n} onClick={()=>setCrewSize(n)}>{n} astronauts</Pill>
            ))}
          </div>
        </Section>

        <Section title="Duration" icon={Calendar}>
          <div className="flex gap-2">
            {[7,14,30].map(n => (
              <Pill key={n} active={duration===n} onClick={()=>setDuration(n)}>{n} days</Pill>
            ))}
          </div>
        </Section>

        <Section title="Objective" icon={Target}>
          <div className="flex flex-wrap gap-2">
            {Object.values(OBJECTIVES).map(o => (
              <Pill key={o.id} active={objective===o.id} onClick={()=>setObjective(o.id)}>{o.label}</Pill>
            ))}
          </div>
        </Section>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={()=>nav('/')} className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
          Cancel
        </button>
        <button onClick={handleLaunch} className="px-6 py-2.5 rounded-lg bg-cyan-400 text-space-900 font-bold hover:bg-cyan-300 shadow-glow">
          Launch Mission
        </button>
      </div>
    </div>
  );
}