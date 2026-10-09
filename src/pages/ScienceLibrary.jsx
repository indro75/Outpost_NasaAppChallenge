import { SCIENCE_ARTICLES } from '../game/science.js';
import { BookOpen, Lightbulb, Gamepad2 } from 'lucide-react';

export default function ScienceLibrary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Science Library</h1>
        <p className="text-slate-400 mt-1">Explore the real science behind the game mechanics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {SCIENCE_ARTICLES.map((article, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-2">{article.category}</div>
            <h3 className="text-xl font-semibold text-white">{article.title}</h3>
            <p className="text-sm text-slate-300 mt-2">{article.summary}</p>
            
            <div className="mt-4 p-3 rounded-lg bg-space-800 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold mb-1">
                <Lightbulb className="w-3 h-3" /> Did you know?
              </div>
              <p className="text-xs text-slate-300">{article.fact}</p>
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
              <Gamepad2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span><b className="text-slate-200">In the game:</b> {article.gameLink}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}