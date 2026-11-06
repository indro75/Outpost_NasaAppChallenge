import { NavLink, useNavigate } from 'react-router-dom';
import { Rocket, Home, BookOpen } from 'lucide-react';

export default function Navbar() {
  const nav = useNavigate();
  const link = 'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2';
  const active = 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 shadow-glow';
  const idle = 'text-slate-300 hover:text-cyan-300 hover:bg-white/5 border border-transparent';

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => nav('/')} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-400 flex items-center justify-center shadow-glow group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(85,214,255,0.6)] transition-all duration-300">
            <Rocket className="w-5 h-5 text-space-900 group-hover:-translate-y-0.5 group-hover:rotate-6 transition-transform duration-300" />
          </div>
          <div className="text-left">
            <div className="font-extrabold tracking-wider text-white text-base group-hover:text-cyan-300 transition-colors">OUTPOST</div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-400/80 font-bold">Junior Trainer</div>
          </div>
        </button>
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={({ isActive }) => `${link} ${isActive ? active : idle}`}>
            <Home className="w-4 h-4" /> Home
          </NavLink>
          <NavLink to="/science" className={({ isActive }) => `${link} ${isActive ? active : idle}`}>
            <BookOpen className="w-4 h-4" /> Science
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
