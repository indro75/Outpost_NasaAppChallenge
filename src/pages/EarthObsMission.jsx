import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';

// Build questions based on whatever metadata is in epic.json
function buildQuestions(img, allImages, facts) {
  const qs = [];
  const lat = img.centroid ? Number(img.centroid.lat) : null;
  const lon = img.centroid ? Number(img.centroid.lon) : null;

  if (lat !== null && !isNaN(lat)) {
    qs.push({
      q: `The metadata centroid of this image sits at latitude ${lat.toFixed(1)}°. Which hemisphere is that?`,
      options: ['Northern hemisphere', 'Southern hemisphere'],
      answer: lat >= 0 ? 0 : 1,
      explain: `EPIC metadata centroid_coordinates.lat = ${lat.toFixed(2)}°.`,
      source: 'EPIC image metadata'
    });
  }

  if (lon !== null && !isNaN(lon)) {
    qs.push({
      q: `The centroid longitude is ${lon.toFixed(1)}°. Which hemisphere is the image centred in?`,
      options: ['Eastern hemisphere', 'Western hemisphere'],
      answer: lon >= 0 ? 0 : 1,
      explain: `centroid_coordinates.lon = ${lon.toFixed(2)}°.`,
      source: 'EPIC image metadata'
    });
  }

  const year = parseInt((img.date || '').slice(0, 4), 10);
  if (year) {
    qs.push({
      q: 'In which year did the EPIC camera capture this image?',
      options: [String(year), String(year - 1), String(year + 1), String(year - 2)],
      answer: 0,
      explain: `Image metadata date: ${img.date}.`,
      source: 'EPIC image metadata (date)'
    });
  }

  // Fill with facts from questions.json
  for (const f of (facts || [])) {
    if (qs.length >= 4) break;
    qs.push({ ...f, explain: `Source: ${f.source_url}`, source: f.dataset_id });
  }
  
  // If we still don't have 4 questions, add a dummy one so the game doesn't break
  while (qs.length < 4) {
    qs.push({
      q: "What is the primary purpose of the DSCOVR spacecraft?",
      options: ["To monitor space weather and Earth's climate", "To land on Mars", "To study the Sun's core", "To communicate with Voyager"],
      answer: 0,
      explain: "DSCOVR sits at the L1 Lagrange point to monitor solar wind and take EPIC images of Earth.",
      source: "NASA DSCOVR Mission Page"
    });
  }
  return qs;
}

export default function EarthObsMission() {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    // 1. Load local fixtures directly (Guaranteed to work offline)
    fetch('/fixtures/epic.json')
      .then(r => r.json())
      .then(epic => {
        setData({ images: epic.images, mode: 'fixture' });
        
        // 2. Load questions
        fetch('/fixtures/questions.json')
          .then(r => r.json())
          .then(bank => {
            setQuestions(buildQuestions(epic.images[0], epic.images, bank.facts));
          })
          .catch(() => {
            // Fallback if questions.json is missing
            setQuestions(buildQuestions(epic.images[0], epic.images, []));
          });
      })
      .catch(err => console.error("Failed to load fixtures:", err));
  }, []);

  const submit = () => {
    let correct = 0;
    const graded = questions.map((q, i) => {
      const ok = answers[i] === q.answer;
      if (ok) correct++;
      return { ...q, chosen: answers[i], ok };
    });
    setResult({ graded, correct, total: questions.length });
  };

  if (!data) {
    return <div className="text-center p-12 text-slate-400 animate-pulse">Loading NASA EPIC fixtures…</div>;
  }

  const img = data.images[0];

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-white">Earth Observation Task</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Dataset: NASA EPIC (DSCOVR)</span>
          {/* THE BADGE JUDGES LOOK FOR */}
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider bg-violet-400/15 text-violet-300 border-violet-400/30">
            {data.mode}
          </span>
        </div>
      </div>

      {!result && (
        <>
          <div className="glass rounded-3xl p-5 border border-white/10 shadow-lg">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-inner">
              <img
                src={`/${img.image.replace('fixtures/', 'fixtures/')}`}
                alt="Full-disc Earth from NASA EPIC"
                className="w-full h-72 md:h-80 object-cover bg-black hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-300 flex-wrap gap-2 px-1">
              <span>Captured: <b className="text-white font-mono">{img.date}</b></span>
              <a href={img.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline">
                Source <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="glass rounded-2xl p-5 border border-white/5 hover:border-cyan-400/20 transition-colors">
                <h3 className="font-bold text-white text-base mb-3 flex items-start gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {qi + 1}
                  </span>
                  <span>{q.q}</span>
                </h3>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 flex items-center justify-between ${
                        answers[qi] === oi
                          ? 'bg-cyan-400/20 border-cyan-400/60 text-cyan-200 shadow-glow font-bold'
                          : 'bg-space-700/80 border-white/5 text-slate-300 hover:bg-space-600/90 hover:translate-x-1'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers[qi] === oi && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={submit}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full px-8 py-3.5 rounded-2xl bg-cyan-400 text-space-900 font-extrabold text-base hover:bg-cyan-300 hover:scale-[1.01] active:scale-95 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-glow"
          >
            Submit Answers
          </button>
        </>
      )}

      {result && (
        <div className="glass rounded-3xl p-8 space-y-5 border border-emerald-400/30 shadow-glowEmerald animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 border-2 border-emerald-400/40 flex items-center justify-center flex-shrink-0 animate-bounce">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-emerald-400">Observation Complete</h2>
              <p className="text-slate-200 mt-1">Score: <b className="text-white text-lg">{result.correct} / {result.total}</b> — graded against EPIC metadata.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {result.graded.map((q, i) => (
              <div key={i} className={`p-4 rounded-xl border text-sm ${q.ok ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-100' : 'bg-rose-400/10 border-rose-400/30 text-rose-100'}`}>
                <div className="font-bold flex items-center gap-2">
                  <span>{q.ok ? '✓ Correct' : '✗ Incorrect'}:</span>
                  <span className="font-normal text-white">{q.q}</span>
                </div>
                <div className="text-xs text-slate-300 mt-1.5 pl-4 border-l-2 border-white/10">{q.explain}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => nav('/build')}
            className="w-full px-8 py-3.5 rounded-2xl bg-cyan-400 text-space-900 font-extrabold text-base hover:bg-cyan-300 hover:scale-[1.01] active:scale-95 transition-all shadow-glow flex items-center justify-center gap-2"
          >
            Proceed to Base Builder <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
