import { useNavigate } from 'react-router-dom';
import { Rocket, Shield, Leaf, FlaskConical, Sparkles } from 'lucide-react';

export default function Landing() {
  const nav = useNavigate();
  const features = [
    { icon: Rocket, title: 'Base Building', text: 'Design a functional outpost with habitats, power, and life support.', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
    { icon: Leaf, title: 'Resource Management', text: 'Balance oxygen, water, food, and power to keep the crew alive.', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    { icon: Shield, title: 'Crew Safety', text: 'Respond to emergencies and protect your astronauts from radiation.', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    { icon: FlaskConical, title: 'Space Science', text: 'Learn real concepts behind every game mechanic.', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' }
  ];

  return (
    <div className="relative">
      <section className="relative overflow-hidden rounded-3xl glass glow-border p-6 md:p-12 text-center">
        {/* Animated ambient cosmic glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/15 via-transparent to-cyan-400/15" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[140%] h-80 rounded-full bg-gradient-to-t from-slate-700 via-slate-800 to-transparent opacity-70 blur-sm" />

        {/* Floating planet illustration background glow */}
        <div className="absolute top-6 right-10 w-24 h-24 rounded-full bg-cyan-400/10 blur-xl animate-float" />
        <div className="absolute bottom-10 left-10 w-28 h-28 rounded-full bg-violet-400/10 blur-xl animate-floatSlow" />

        <div className="relative z-10 max-w-3xl mx-auto py-8 md:py-12">
          {/* Fun Junior Mission Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-4 shadow-sm animate-float">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} /> Junior Astronaut Mission Control
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Humanity's Next Home <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(85,214,255,0.4)]">Starts With You</span>
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Become a mission commander. Build an outpost on the Moon or Mars, manage limited resources,
            respond to emergencies, and bring your crew home safely.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => nav('/checklist')}
              className="px-7 py-3.5 rounded-2xl bg-cyan-400 text-space-900 font-extrabold text-base hover:bg-cyan-300 shadow-glow hover:shadow-[0_0_30px_rgba(85,214,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
            >
              <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Mission
            </button>
            <button
              onClick={() => nav('/how-to-play')}
              className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 font-semibold text-slate-200 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              How to Play
            </button>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass rounded-2xl p-5 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-glow transition-all duration-300 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
              <f.icon className={`w-6 h-6 ${f.color}`} />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">{f.title}</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
