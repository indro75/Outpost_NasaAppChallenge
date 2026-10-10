import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Target } from 'lucide-react';

export default function DockingMission() {
  const nav = useNavigate();
  const [pos, setPos] = useState({ x: 50, y: 50 }); // Percentage
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState('playing');
  const keysPressed = useRef({});

  useEffect(() => {
    const handleDown = (e) => keysPressed.current[e.key] = true;
    const handleUp = (e) => keysPressed.current[e.key] = false;
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  useEffect(() => {
    if (status !== 'playing' || fuel <= 0) {
      if (fuel <= 0) setStatus('fail');
      return;
    }
    const interval = setInterval(() => {
      let dx = 0, dy = 0;
      if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) dy -= 1.5;
      if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) dy += 1.5;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) dx -= 1.5;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) dx += 1.5;

      if (dx !== 0 || dy !== 0) {
        setPos(p => ({ x: Math.max(0, Math.min(100, p.x + dx)), y: Math.max(0, Math.min(100, p.y + dy)) }));
        setFuel(f => Math.max(0, f - 0.5));
      }

      // Check win condition (Target is at 50,50. Must be within 5%)
      const dist = Math.sqrt(Math.pow(pos.x - 50, 2) + Math.pow(pos.y - 50, 2));
      if (dist < 5) setStatus('success');
    }, 50);
    return () => clearInterval(interval);
  }, [status, fuel, pos]);

  // Touch controls for mobile
  const move = (dir) => {
    if (status !== 'playing' || fuel <= 0) return;
    let dx = 0, dy = 0;
    if (dir === 'up') dy = -5; if (dir === 'down') dy = 5;
    if (dir === 'left') dx = -5; if (dir === 'right') dx = 5;
    setPos(p => ({ x: Math.max(0, Math.min(100, p.x + dx)), y: Math.max(0, Math.min(100, p.y + dy)) }));
    setFuel(f => Math.max(0, f - 2));
  };

  if (status === 'success') {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <Target className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-emerald-400">Docking Successful!</h2>
        <p className="text-slate-300 mt-2">Hard seal achieved. Welcome to the station.</p>
        <button onClick={() => nav('/earth-obs')} className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold">
          Begin Earth Observation
        </button>
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <Rocket className="w-16 h-16 text-rose-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-rose-400">Docking Failed!</h2>
        <p className="text-slate-300 mt-2">Fuel depleted or trajectory lost.</p>
        <button onClick={() => { setPos({x:50,y:50}); setFuel(100); setStatus('playing'); }} className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold">
          Retry Docking
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Docking Sequence</h1>
        <div className="text-cyan-400 font-bold">Fuel: {Math.round(fuel)}%</div>
      </div>
      
      {/* Game Area */}
      <div className="relative h-80 rounded-xl bg-space-800 border border-white/10 overflow-hidden">
        {/* Target */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-emerald-400/50 flex items-center justify-center">
          <Target className="w-8 h-8 text-emerald-400" />
        </div>
        {/* Player Ship */}
        <div 
          className="absolute w-10 h-10 transition-transform duration-75"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <Rocket className="w-10 h-10 text-cyan-400" />
        </div>
      </div>

      {/* Touch Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        <div></div>
        <button onClick={() => move('up')} className="h-12 rounded-lg bg-space-700 active:bg-cyan-400/30 flex items-center justify-center">▲</button>
        <div></div>
        <button onClick={() => move('left')} className="h-12 rounded-lg bg-space-700 active:bg-cyan-400/30 flex items-center justify-center">◀</button>
        <div className="h-12 rounded-lg bg-space-900 flex items-center justify-center text-xs text-slate-500">Use Arrows</div>
        <button onClick={() => move('right')} className="h-12 rounded-lg bg-space-700 active:bg-cyan-400/30 flex items-center justify-center">▶</button>
        <div></div>
        <button onClick={() => move('down')} className="h-12 rounded-lg bg-space-700 active:bg-cyan-400/30 flex items-center justify-center">▼</button>
        <div></div>
      </div>
    </div>
  );
}