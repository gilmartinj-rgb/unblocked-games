import React from 'react';
import { Heart, Play, Star } from 'lucide-react';
import { resolveUrl } from '../utils/paths.js';

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite
}) => {
  const thumbnailUrl = resolveUrl(game.thumbnail);

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200 cursor-pointer text-left"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center transition-all"
            style={{
              background: `linear-gradient(135deg, #090d16 0%, ${game.accentColor || '#334155'}25 100%)`
            }}
          >
            <div className="text-3xl mb-1.5 opacity-80 group-hover:scale-110 transition-transform">
              🎮
            </div>
            <div className="text-xs font-semibold text-slate-300 line-clamp-1">
              {game.title}
            </div>
          </div>
        )}

        {/* Favorite heart button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-md backdrop-blur bg-slate-950/60 border border-slate-700/60 transition-colors z-10 ${
            isFavorite
              ? 'text-rose-500 hover:text-rose-400'
              : 'text-slate-400 hover:text-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Play hover overlay */}
        <div className="absolute inset-0 bg-sky-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Clean unboxed metadata separator */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
          <span className="text-sky-400 font-medium">{game.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="tabular-nums font-medium text-slate-300">{game.rating}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums text-slate-400">{game.plays.toLocaleString()} plays</span>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors mb-1.5 leading-snug">
          {game.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {game.description}
        </p>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span className="truncate max-w-[180px]">{game.controls}</span>
          <span className="text-sky-400 text-[11px] font-sans font-medium group-hover:underline">Play &rarr;</span>
        </div>
      </div>
    </div>
  );
};
