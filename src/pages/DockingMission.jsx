import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Target, CheckCircle, AlertTriangle } from 'lucide-react';

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
    setStatus('playing');
    setFailReason('');
  };

  if (status === 'success') {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-emerald-400">Docking Successful!</h2>
        <p className="text-slate-300 mt-2">Hard seal achieved. Welcome to the station.</p>
        <button onClick={() => nav('/earth-obs')} className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold hover:bg-cyan-300">
          Begin Earth Observation
        </button>
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-rose-400">Docking Failed!</h2>
        <p className="text-slate-300 mt-2">{failReason}</p>
        <button onClick={retry} className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold hover:bg-cyan-300">
          Retry Docking
        </button>
      </div>
    );
  }

  const dist = Math.hypot(pos.x - TARGET.x, pos.y - TARGET.y);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Docking Sequence</h1>
          <span className="text-[10px] px-2 py-1 rounded bg-violet-400/10 text-violet-400 border border-violet-400/20 font-bold">{VERSION}</span>
        </div>
        <div className={`text-xl font-bold tabular-nums ${fuel < 20 ? 'text-rose-400' : 'text-cyan-400'}`}>
          Fuel: {Math.round(fuel)}%
        </div>
      </div>

      <div className="glass rounded-lg p-3 flex flex-wrap gap-4 text-sm tabular-nums">
        <span>Distance to station: <b className="text-cyan-400">{dist.toFixed(1)}</b></span>
        <span>Speed: <b className={speed > MAX_DOCK_SPEED ? 'text-rose-400' : 'text-emerald-400'}>{speed.toFixed(2)}</b></span>
        <span className="text-slate-400">Dock when distance &lt; {DOCKING_RADIUS} AND speed &lt; {MAX_DOCK_SPEED}</span>
      </div>

      <p className="text-sm text-slate-400">
        <span className="text-cyan-400 font-semibold">Controls:</span> Arrow keys / WASD, or the buttons below.
        The ship drifts like a real spacecraft — press the opposite direction to slow down!
      </p>

      <div className="relative h-80 rounded-xl bg-space-800 border border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#55D6FF 1px, transparent 1px), linear-gradient(90deg, #55D6FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-emerald-400/50 flex items-center justify-center">
          <Target className="w-8 h-8 text-emerald-400" />
        </div>
        <div
          className="absolute w-10 h-10"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `translate(-50%, -50%) rotate(${Math.atan2(velRef.current.y, velRef.current.x) * 180 / Math.PI + 90}deg)`
          }}
        >
          <Rocket className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(85,214,255,0.8)]" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto select-none">
        <div></div>
        <button onPointerDown={() => thrust('up')} className="h-14 rounded-lg bg-space-700 border border-white/10 active:bg-cyan-400/30 flex items-center justify-center text-xl font-bold">▲</button>
        <div></div>
        <button onPointerDown={() => thrust('left')} className="h-14 rounded-lg bg-space-700 border border-white/10 active:bg-cyan-400/30 flex items-center justify-center text-xl font-bold">◀</button>
        <div className="h-14 rounded-lg bg-space-900 border border-white/5 flex items-center justify-center text-[10px] text-slate-500 uppercase">Thrust</div>
        <button onPointerDown={() => thrust('right')} className="h-14 rounded-lg bg-space-700 border border-white/10 active:bg-cyan-400/30 flex items-center justify-center text-xl font-bold">▶</button>
        <div></div>
        <button onPointerDown={() => thrust('down')} className="h-14 rounded-lg bg-space-700 border border-white/10 active:bg-cyan-400/30 flex items-center justify-center text-xl font-bold">▼</button>
        <div></div>
      </div>
    </div>
  );
}