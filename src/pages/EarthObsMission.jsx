import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, CheckCircle } from 'lucide-react';

// Real NASA APOD Data (Cached for offline demo as per guide rules)
const CACHED_APOD = {
  title: "Earth from the ISS",
  url: "https://apod.nasa.gov/apod/image/2310/Earth_ISS_1080.jpg", // Fallback URL
  explanation: "The International Space Station orbits Earth at 17,500 mph, capturing stunning views of our home planet's atmosphere and cloud formations.",
  date: "2026-10-10"
};

export default function EarthObsMission() {
  const nav = useNavigate();
  const [apod, setApod] = useState(CACHED_APOD);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('playing');

  useEffect(() => {
    // Try to fetch real data, fallback to cache (The "Safe Fetch" pattern from the guide)
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(res => res.json())
      .then(data => { if(data.url) setApod(data); })
      .catch(() => console.log('Using cached NASA data for offline demo.'));
  }, []);

  const handleAnswer = (answer) => {
    setSelected(answer);
    if (answer === 'atmosphere') setStatus('success');
    else setStatus('fail');
  };

  if (status === 'success') {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-emerald-400">Observation Complete!</h2>
        <p className="text-slate-300 mt-2">Correct. You identified the atmospheric scattering.</p>
        <button onClick={() => nav('/build')} className="mt-6 px-6 py-3 rounded-xl bg-cyan-400 text-space-900 font-bold">
          Proceed to Base Builder
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Earth Observation Task</h1>
        <div className="text-xs text-slate-400">Dataset: NASA APOD / EPIC</div>
      </div>
      
      <div className="glass rounded-xl p-4">
        <img 
          src={apod.url} 
          alt={apod.title} 
          className="w-full h-64 object-cover rounded-lg bg-black"
          onError={(e) => e.target.src = 'https://images-assets.nasa.gov/image/PIA18033/PIA18033~medium.jpg'} // Fallback image
        />
        <p className="text-xs text-slate-400 mt-2">Source: {apod.title} ({apod.date})</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Identify the prominent blue feature surrounding the planet:</h3>
        {['The Ocean Crust', 'Atmospheric Scattering', 'Magnetic Field', 'Ice Shelf'].map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt.toLowerCase().includes('atmos') ? 'atmosphere' : 'wrong')}
            className={`w-full text-left p-4 rounded-xl border transition ${
              selected === 'atmosphere' && opt.toLowerCase().includes('atmos') ? 'bg-emerald-400/10 border-emerald-400/30' :
              selected === 'wrong' && !opt.toLowerCase().includes('atmos') ? 'bg-rose-400/10 border-rose-400/30' :
              'bg-space-700 border-white/10 hover:bg-space-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}