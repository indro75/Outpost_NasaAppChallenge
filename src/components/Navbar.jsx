import { NavLink, useNavigate } from 'react-router-dom';
import { Rocket, Home, BookOpen } from 'lucide-react'; // <-- Make sure there is only ONE import line like this

export default function Navbar() {
  const nav = useNavigate();
  const link = 'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2';
  const active = 'bg-cyan-400/10 text-cyan-400';
  const idle = 'text-slate-300 hover:text-cyan-400 hover:bg-white/5';

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => nav('/')} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-400 flex items-center justify-center shadow-glow">
            <Rocket className="w-5 h-5 text-space-900" />
          </div>
          <div className="text-left">
            <div className="font-bold tracking-wide text-white">OUTPOST</div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-400/80">Junior Trainer</div>
          </div>
        </button>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={({isActive}) => `${link} ${isActive?active:idle}`}>
            <Home className="w-4 h-4" /> Home
          </NavLink>
          <NavLink to="/science" className={({isActive}) => `${link} ${isActive?active:idle}`}>
            <BookOpen className="w-4 h-4" /> Science
          </NavLink>
        </nav>
      </div>
    </header>
  );
}