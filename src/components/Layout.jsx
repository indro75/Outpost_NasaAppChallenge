import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  return (
    <div className="relative min-h-screen text-slate-100">
      <div className="fixed inset-0 bg-gradient-to-b from-space-900 via-space-800 to-space-900" />
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <Outlet />
        </main>
        <footer className="max-w-7xl mx-auto px-4 py-10 text-xs text-slate-400 border-t border-white/5 mt-10">
          <p>OUTPOST is an educational simulation. Gameplay values are fictionalized for teaching.</p>
        </footer>
      </div>
    </div>
  );
}