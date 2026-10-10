import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

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
      <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-emerald-400">Checklist Complete!</h2>
        <p className="text-slate-300 mt-2">All systems nominal. Proceeding to docking.</p>
        <button onClick={() => nav('/docking')} className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold">
          Start Docking Sequence
        </button>
      </div>
    );
  }

  if (status === 'fail') {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-rose-400">Sequence Aborted!</h2>
        <p className="text-slate-300 mt-2">{timeLeft === 0 ? 'Time ran out.' : 'Incorrect sequence. Safety protocols engaged.'}</p>
        <button onClick={() => { setCurrentStep(0); setTimeLeft(30); setStatus('playing'); }} className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold">
          Retry Checklist
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pre-Launch Checklist</h1>
        <div className={`flex items-center gap-2 text-xl font-bold ${timeLeft < 10 ? 'text-rose-400' : 'text-cyan-400'}`}>
          <Clock className="w-5 h-5" /> {timeLeft}s
        </div>
      </div>
      <p className="text-slate-400">Click the systems in the correct order before time runs out!</p>
      
      <div className="space-y-3">
        {CHECKLIST_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isNext = index === currentStep;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={isDone}
              className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                isDone ? 'bg-emerald-400/10 border-emerald-400/30 opacity-50' :
                isNext ? 'bg-cyan-400/10 border-cyan-400/50 hover:bg-cyan-400/20' :
                'bg-space-700 border-white/10 hover:bg-space-600'
              }`}
            >
              <div>
                <div className="font-semibold">{step.name}</div>
                <div className="text-xs text-slate-400">{step.detail}</div>
              </div>
              {isDone && <CheckCircle className="w-6 h-6 text-emerald-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}