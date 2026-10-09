import { Rocket, Hammer, Gauge, AlertTriangle, Trophy } from 'lucide-react';

export default function HowToPlay() {
  const steps = [
    { icon: Rocket, title: '1. Set Up Your Mission', text: 'Choose a destination (Moon or Mars), difficulty, crew size, duration, and objective.' },
    { icon: Hammer, title: '2. Build Your Base', text: 'Spend your cargo budget on habitats, power, life support, and science. Every building has trade-offs.' },
    { icon: Gauge, title: '3. Manage Resources', text: 'Advance day by day. Keep oxygen, water, food, and power above zero.' },
    { icon: AlertTriangle, title: '4. Respond to Events', text: 'Emergencies will test your planning. Use spare parts wisely.' },
    { icon: Trophy, title: '5. Complete the Mission', text: 'Survive the duration and maximize your score through safe, efficient decisions.' }
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">How to Play</h1>
        <p className="text-slate-400 mt-1">A quick guide to becoming a mission commander.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {steps.map(s => (
          <div key={s.title} className="glass rounded-2xl p-5 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <s.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-slate-300 mt-1">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}