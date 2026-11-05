import React from 'react';
import { Gamepad2, Shuffle } from 'lucide-react';

export const Header = ({
  onSelectNav,
  activeNav,
  onRandomGame,
  favoritesCount
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectNav('all');
        }}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 group hover:text-sky-400 transition-colors"
      >
        <Gamepad2 className="w-5 h-5 text-sky-400 group-hover:rotate-12 transition-transform" />
        <span>Nova Arcade</span>
      </a>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectNav('all')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeNav === 'all' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          All Games
        </button>
        <button
          onClick={() => onSelectNav('favorites')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeNav === 'favorites' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          Favorites {favoritesCount > 0 ? `(${favoritesCount})` : ''}
        </button>
        <button
          onClick={() => onSelectNav('add')}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Add Game
        </button>
        <button
          onClick={() => onSelectNav('json')}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          JSON Data
        </button>
        <button
          onClick={() => onSelectNav('cloak')}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Tab Cloak
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRandomGame}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 rounded-lg hover:bg-sky-300 active:scale-95 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-sky-500/20"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Random Game</span>
        </button>
      </div>
    </header>
  );
};
