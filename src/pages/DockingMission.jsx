import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Target, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

const TARGET = { x: 50, y: 50 };
const START = { x: 15, y: 15 };
const DOCKING_RADIUS = 7;
const MAX_DOCK_SPEED = 1.5;
const VERSION = 'DOCK v3';

export default function DockingMission() {
  const nav = useNavigate();
  const [pos, setPos] = useState({ ...START });
  const [speed, setSpeed] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [angle, setAngle] = useState(90);
  const [status, setStatus] = useState('playing');
  const [failReason, setFailReason] = useState('');

  const posRef = useRef({ ...START });
  const velRef = useRef({ x: 0, y: 0 });
  const fuelRef = useRef(100);
  const keysRef = useRef({});
  const armedRef = useRef(false); // win/lose ONLY after first input

  const arm = () => { armedRef.current = true; };

  useEffect(() => {
    const down = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keysRef.current[k] = true;
      if (e.key.startsWith('Arrow')) e.preventDefault();
      arm();
    };
    const up = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keysRef.current[k] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    if (status !== 'playing') return;
    const loop = setInterval(() => {
      const keys = keysRef.current;
      let tx = 0, ty = 0;
      const THRUST = 0.35;
      if (keys['ArrowUp'] || keys['w']) ty -= THRUST;
      if (keys['ArrowDown'] || keys['s']) ty += THRUST;
      if (keys['ArrowLeft'] || keys['a']) tx -= THRUST;
      if (keys['ArrowRight'] || keys['d']) tx += THRUST;

      const thrusting = tx !== 0 || ty !== 0;
      if (thrusting) fuelRef.current = Math.max(0, fuelRef.current - 0.25);

      velRef.current.x = (velRef.current.x + tx) * 0.97;
      velRef.current.y = (velRef.current.y + ty) * 0.97;
      posRef.current.x = Math.max(2, Math.min(98, posRef.current.x + velRef.current.x));
      posRef.current.y = Math.max(2, Math.min(98, posRef.current.y + velRef.current.y));

      const dist = Math.hypot(posRef.current.x - TARGET.x, posRef.current.y - TARGET.y);
      const spd = Math.hypot(velRef.current.x, velRef.current.y);

      setPos({ ...posRef.current });
      setSpeed(spd);
      setFuel(fuelRef.current);
      if (velRef.current.x !== 0 || velRef.current.y !== 0) {
        setAngle(Math.atan2(velRef.current.y, velRef.current.x) * 180 / Math.PI + 90);
      }

      // Impossible to win or lose before the player touches controls
      if (!armedRef.current) return;

      if (dist < DOCKING_RADIUS) {
        if (spd > MAX_DOCK_SPEED) {
          setStatus('fail');
          setFailReason('Too fast! You crashed into the station. Approach slowly.');
        } else {
          setStatus('success');
        }
        return;
      }
      if (fuelRef.current <= 0 && spd < 0.05) {
        setStatus('fail');
        setFailReason('Out of fuel while still far from the station.');
      }
    }, 30);
    return () => clearInterval(loop);
  }, [status]);

  const thrust = (dir) => {
    if (status !== 'playing') return;
    arm();
    const P = 1.2;
    if (dir === 'up') velRef.current.y -= P;
    if (dir === 'down') velRef.current.y += P;
    if (dir === 'left') velRef.current.x -= P;
    if (dir === 'right') velRef.current.x += P;
    fuelRef.current = Math.max(0, fuelRef.current - 1.5);
  };

  const retry = () => {
    posRef.current = { ...START };
    velRef.current = { x: 0, y: 0 };
    fuelRef.current = 100;
    armedRef.current = false;
    setPos({ ...START });
    setSpeed(0);
    setFuel(100);
    setAngle(90);
    setStatus('playing');
    setFailReason('');
  };

  if (status === 'success') {
    return (
      <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto mt-10 border border-emerald-400/40 shadow-glowEmerald animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-400/20 border-2 border-emerald-400/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-400">Docking Successful!</h2>
        <p className="text-slate-200 mt-2 text-base">Hard seal achieved. Welcome to the station.</p>
        <button
          onClick={() => nav('/earth-obs')}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-cyan-400 text-space-900 font-extrabold text-base hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all shadow-glow inline-flex items-center gap-2"
        >
          Begin Earth Observation <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto mt-10 border border-rose-400/40 shadow-lg animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-rose-400/20 border-2 border-rose-400/40 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <AlertTriangle className="w-12 h-12 text-rose-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-400">Docking Failed!</h2>
        <p className="text-slate-300 mt-2 text-base">{failReason}</p>
        <button
          onClick={retry}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-cyan-400 text-space-900 font-extrabold text-base hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all shadow-glow inline-flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Retry Docking
        </button>
      </div>
    );
  }

  const dist = Math.hypot(pos.x - TARGET.x, pos.y - TARGET.y);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">Docking Sequence</h1>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-400/15 text-violet-300 border border-violet-400/30 font-bold">{VERSION}</span>
        </div>
        <div className={`text-xl font-bold font-mono px-3.5 py-1.5 rounded-xl border tabular-nums transition-all ${
          fuel < 20
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
            : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
        }`}>
          Fuel: {Math.round(fuel)}%
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap gap-4 text-sm tabular-nums border border-white/10 items-center justify-between">
        <div className="flex gap-4">
          <span>Distance to station: <b className="text-cyan-400 text-base">{dist.toFixed(1)}</b></span>
          <span>Speed: <b className={`text-base font-bold ${speed > MAX_DOCK_SPEED ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>{speed.toFixed(2)}</b></span>
        </div>
        <span className="text-xs text-slate-300 bg-space-800 px-3 py-1 rounded-lg border border-white/5">
          Dock when distance &lt; {DOCKING_RADIUS} AND speed &lt; {MAX_DOCK_SPEED}
        </span>
      </div>

      <p className="text-sm text-slate-400">
        <span className="text-cyan-400 font-semibold">Controls:</span> Arrow keys / WASD, or the buttons below.
        The ship drifts like a real spacecraft — press the opposite direction to slow down!
      </p>

      {/* Interactive Arena with Animated Radar Grids */}
      <div className="relative h-80 rounded-2xl bg-space-900 border border-cyan-400/30 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(#55D6FF 1px, transparent 1px), linear-gradient(90deg, #55D6FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Animated Radar Pulse from Target */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-emerald-400/30 animate-ping opacity-40 pointer-events-none" />
        
        {/* Docking Target Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-emerald-400/60 bg-emerald-400/10 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]">
          <Target className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        {/* Spacecraft Rocket */}
        <div
          className="absolute w-10 h-10 transition-transform"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`
          }}
        >
          <Rocket className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(85,214,255,0.9)]" />
        </div>
      </div>

      {/* Tactile Touch Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto select-none pt-2">
        <div />
        <button onPointerDown={() => thrust('up')} className="h-14 rounded-2xl bg-space-700/80 hover:bg-space-600 border border-white/10 active:bg-cyan-400 active:text-space-900 flex items-center justify-center text-xl font-bold shadow transition-all">▲</button>
        <div />
        <button onPointerDown={() => thrust('left')} className="h-14 rounded-2xl bg-space-700/80 hover:bg-space-600 border border-white/10 active:bg-cyan-400 active:text-space-900 flex items-center justify-center text-xl font-bold shadow transition-all">◀</button>
        <div className="h-14 rounded-2xl bg-space-900/90 border border-cyan-400/20 flex items-center justify-center text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider">Thrust</div>
        <button onPointerDown={() => thrust('right')} className="h-14 rounded-2xl bg-space-700/80 hover:bg-space-600 border border-white/10 active:bg-cyan-400 active:text-space-900 flex items-center justify-center text-xl font-bold shadow transition-all">▶</button>
        <div />
        <button onPointerDown={() => thrust('down')} className="h-14 rounded-2xl bg-space-700/80 hover:bg-space-600 border border-white/10 active:bg-cyan-400 active:text-space-900 flex items-center justify-center text-xl font-bold shadow transition-all">▼</button>
        <div />
      </div>
    </div>
  );
}
