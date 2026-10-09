import { useNavigate } from 'react-router-dom';
import { Rocket, Shield, Leaf, FlaskConical, Sparkles } from 'lucide-react';

export default function Landing() {
  const nav = useNavigate();
  const features = [
    { icon: Rocket, title: 'Base Building', text: 'Design a functional outpost with habitats, power, and life support.' },
    { icon: Leaf, title: 'Resource Management', text: 'Balance oxygen, water, food, and power to keep the crew alive.' },
    { icon: Shield, title: 'Crew Safety', text: 'Respond to emergencies and protect your astronauts from radiation.' },
    { icon: FlaskConical, title: 'Space Science', text: 'Learn real concepts behind every game mechanic.' }
  ];

  return (
    <div className="relative">
      <section className="relative overflow-hidden rounded-3xl glass glow-border">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[140%] h-80 rounded-full bg-gradient-to-t from-slate-700 via-slate-800 to-transparent opacity-70 blur-sm" />
        <div className="relative px-6 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> NASA Space Apps Challenge
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Humanity's Next Home <span className="text-cyan-400">Starts With You</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Become a mission commander. Build an outpost on the Moon or Mars, manage limited resources,
            respond to emergencies, and bring your crew home safely.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => nav('/setup')}
              className="px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold hover:bg-cyan-300 shadow-glow transition"
            >
              Start Your Mission
            </button>
            <button
              onClick={() => nav('/how-to-play')}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold transition"
            >
              How to Play
            </button>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {features.map((f, i) => (
          <div key={f.title} className="glass rounded-2xl p-5">
            <div className="w-10 h-10 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}