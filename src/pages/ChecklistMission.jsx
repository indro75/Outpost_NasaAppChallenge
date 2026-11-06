import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock, ArrowRight, RotateCcw } from 'lucide-react';

const CHECKLIST_STEPS = [
  { id: 1, name: 'Verify Cabin Pressure', detail: 'Must be 14.7 psi' },
  { id: 2, name: 'Engage Life Support', detail: 'O2 flow nominal' },
  { id: 3, name: 'Calibrate Navigation', detail: 'Star tracker locked' },
  { id: 4, name: 'Ignite Main Engine', detail: 'Thrust at 100%' }
];

export default function ChecklistMission() {
  const nav = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState('playing'); // playing, success, fail

  useEffect(() => {
    if (status !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setStatus('fail'); clearInterval(timer); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const handleStepClick = (stepId) => {
    if (stepId === currentStep + 1) {
      if (currentStep + 1 === CHECKLIST_STEPS.length) {
        setStatus('success');
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      setStatus('fail'); // Wrong order!
    }
  };

  if (status === 'success') {
    return (
      <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto mt-10 border border-emerald-400/40 shadow-glowEmerald animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-400/20 border-2 border-emerald-400/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-400">Checklist Complete!</h2>
        <p className="text-slate-200 mt-2 text-base">All systems nominal. Proceeding to docking.</p>
        <button
          onClick={() => nav('/docking')}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-cyan-400 text-space-900 font-extrabold text-base hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all shadow-glow inline-flex items-center gap-2"
        >
          Start Docking Sequence <ArrowRight className="w-5 h-5" />
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-400">Sequence Aborted!</h2>
        <p className="text-slate-300 mt-2 text-base">{timeLeft === 0 ? 'Time ran out.' : 'Incorrect sequence. Safety protocols engaged.'}</p>
        <button
          onClick={() => { setCurrentStep(0); setTimeLeft(30); setStatus('playing'); }}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-cyan-400 text-space-900 font-extrabold text-base hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all shadow-glow inline-flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Retry Checklist
        </button>
      </div>
    );
  }

  const progressPct = (currentStep / CHECKLIST_STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Pre-Launch Checklist</h1>
          <p className="text-slate-400 text-sm mt-1">Click the systems in the correct order before time runs out!</p>
        </div>
        <div className={`flex items-center gap-2 text-2xl font-mono font-extrabold px-4 py-2 rounded-2xl border transition-all ${
          timeLeft < 10
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse scale-105 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
            : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
        }`}>
          <Clock className="w-5 h-5" /> {timeLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-xl p-3 border border-white/5 space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Systems Armed: {currentStep} / {CHECKLIST_STEPS.length}</span>
          <span className="font-mono text-cyan-400">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-2.5 bg-space-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        {CHECKLIST_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isNext = index === currentStep;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={isDone}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-400/10 border-emerald-400/40 opacity-70'
                  : isNext
                  ? 'bg-cyan-400/15 border-cyan-400/60 shadow-glow hover:bg-cyan-400/25 hover:scale-[1.01] active:scale-98 cursor-pointer'
                  : 'bg-space-700/80 border-white/10 hover:bg-space-600/80 opacity-90'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                  isDone
                    ? 'bg-emerald-400/20 text-emerald-300'
                    : isNext
                    ? 'bg-cyan-400 text-space-900 font-black'
                    : 'bg-space-800 text-slate-400'
                }`}>
                  {step.id}
                </span>
                <div>
                  <div className="font-bold text-white text-base">{step.name}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{step.detail}</div>
                </div>
              </div>
              {isDone && <CheckCircle className="w-6 h-6 text-emerald-400 animate-fadeIn" />}
              {isNext && <span className="text-xs text-cyan-300 font-bold uppercase tracking-wider animate-pulse hidden sm:inline">Click to Arm →</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
