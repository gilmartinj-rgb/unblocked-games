import React from 'react';
import { Play, Sparkles, Star } from 'lucide-react';
import { resolveUrl } from '../utils/paths.js';

export const HeroSpotlight = ({
  featuredGame,
  onPlayGame,
  totalGames
}) => {
  if (!featuredGame) return null;

  const thumbnailUrl = resolveUrl(featuredGame.thumbnail);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 mb-10 shadow-xl">
      {/* Background glow element */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: featuredGame.accentColor || '#38bdf8' }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Spotlight</span>
            <span aria-hidden="true">·</span>
            <span>{featuredGame.category}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {featuredGame.title}
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
            {featuredGame.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
            <span>By {featuredGame.author}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="tabular-nums font-semibold">{featuredGame.rating}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{featuredGame.plays.toLocaleString()} plays</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlayGame(featuredGame)}
              className="px-6 py-3 text-sm font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-95 transition-all rounded-lg flex items-center gap-2 shadow-lg shadow-sky-500/25"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Now</span>
            </button>
            <div className="text-xs text-slate-400 font-mono">
              Controls: {featuredGame.controls}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative group cursor-pointer" onClick={() => onPlayGame(featuredGame)}>
          <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl aspect-video bg-slate-950">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={featuredGame.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                style={{
                  background: `linear-gradient(135deg, #0f172a 0%, ${featuredGame.accentColor || '#1e293b'}33 100%)`
                }}
              >
                <div className="text-4xl mb-2">🎮</div>
                <div className="font-bold text-lg text-white">{featuredGame.title}</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
              <div className="text-xs font-medium text-white flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
                <span>Launch in Embedded Iframe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-extrabold text-white tabular-nums">{totalGames}</div>
          <div className="text-xs text-slate-400 mt-0.5">Games in JSON</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">100%</div>
          <div className="text-xs text-slate-400 mt-0.5">Unblocked Iframe</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-sky-400 tabular-nums">0 ms</div>
          <div className="text-xs text-slate-400 mt-0.5">Server Latency</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-amber-400 tabular-nums">No Ads</div>
          <div className="text-xs text-slate-400 mt-0.5">Clean Sandbox</div>
        </div>
      </div>
    </div>
  );
};
