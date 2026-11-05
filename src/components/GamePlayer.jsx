import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Heart,
  Tv,
  Star,
  Keyboard,
  Share2,
  Check
} from 'lucide-react';
import { resolveUrl, resolveIframeSrc } from '../utils/paths.js';

export const GamePlayer = ({
  game,
  onBack,
  onSelectGame,
  allGames,
  isFavorite,
  onToggleFavorite
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const frameContainerRef = useRef(null);

  const iframeSrc = resolveIframeSrc(game.iframe);

  const toggleFullscreen = () => {
    if (!frameContainerRef.current) return;
    if (!document.fullscreenElement) {
      frameContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePopout = () => {
    window.open(iframeSrc, '_blank');
  };

  const otherGames = allGames.filter((g) => g.id !== game.id).slice(0, 4);

  return (
    <div className={`space-y-6 ${isTheater ? 'max-w-none' : 'max-w-6xl mx-auto'}`}>
      {/* Top Player Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games Hub</span>
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight flex items-center gap-2">
              <span>{game.title}</span>
              <span className="text-xs text-sky-400 font-normal">({game.category})</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>By {game.author}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-amber-400">
                <Star className="w-3 h-3 fill-current" />
                <span className="tabular-nums">{game.rating}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-lg border border-slate-700/80 transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isFavorite ? 'In Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
            title="Reload Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`p-2 rounded-lg border border-slate-700/80 transition-colors cursor-pointer ${
              isTheater
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Theater Mode"
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePopout}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
            title="Pop out in separate tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Responsive Iframe Game Canvas Container */}
      <div
        ref={frameContainerRef}
        className={`relative w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-all ${
          isTheater ? 'h-[80vh]' : 'h-[620px] max-h-[75vh]'
        }`}
      >
        <iframe
          key={iframeKey}
          src={iframeSrc}
          title={game.title}
          className="w-full h-full border-0 block"
          allow="fullscreen; autoplay; gamepad; keyboard"
          loading="eager"
        />
      </div>

      {/* Game Details & Controls Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            About {game.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {game.description}
          </p>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-300 font-semibold">Iframe Source:</span>
            <code className="bg-slate-950 px-2 py-1 rounded text-sky-300 text-[11px] font-mono truncate max-w-md">
              {iframeSrc}
            </code>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300">
            <Keyboard className="w-4 h-4 text-sky-400" />
            <span>Controls Guide</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-200 leading-relaxed">
            {game.controls}
          </div>
          <div className="text-[11px] text-slate-500">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">Esc</kbd> anytime for stealth cloak.
          </div>
        </div>
      </div>

      {/* Up Next Strip */}
      {otherGames.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            More Games In Catalogue
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherGames.map((g) => (
              <div
                key={g.id}
                onClick={() => onSelectGame(g)}
                className="group p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all text-left"
              >
                <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden mb-2 relative">
                  {g.thumbnail ? (
                    <img
                      src={resolveUrl(g.thumbnail)}
                      alt={g.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      🎮
                    </div>
                  )}
                </div>
                <div className="font-bold text-xs text-white group-hover:text-sky-400 truncate">
                  {g.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{g.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
