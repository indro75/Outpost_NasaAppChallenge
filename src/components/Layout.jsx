import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-400/30 selection:text-cyan-200">
      {/* Animated cosmic background */}
      <div className="fixed inset-0 bg-gradient-to-b from-space-900 via-space-800 to-space-900" />
      <div className="fixed inset-0 stars-bg opacity-70 pointer-events-none" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <Outlet />
        </main>
        <footer className="max-w-7xl mx-auto px-4 py-10 text-xs text-slate-400 border-t border-white/5 mt-10 text-center md:text-left">
          <p>OUTPOST is an educational simulation. Gameplay values are fictionalized for teaching.</p>
        </footer>
      </div>
    </div>
  );
}
