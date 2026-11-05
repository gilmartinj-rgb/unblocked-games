import React, { useState, useEffect, useMemo } from 'react';
import { Search, Heart, RefreshCcw, Plus, FileCode, Shield } from 'lucide-react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { resolveUrl } from './utils/paths.js';
import { Header } from './components/Header.jsx';
import { HeroSpotlight } from './components/HeroSpotlight.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonManagerModal } from './components/JsonManagerModal.jsx';
import { TabCloakModal, CLOAK_PRESETS } from './components/TabCloakModal.jsx';
import { PanicScreen } from './components/PanicScreen.jsx';

const STORAGE_FAVORITES_KEY = 'nova_arcade_favorites';
const STORAGE_CUSTOM_GAMES_KEY = 'nova_arcade_custom_games';
const STORAGE_CLOAK_KEY = 'nova_arcade_cloak_preset';

export default function App() {
  const [games, setGames] = useState(DEFAULT_GAMES);
  const [activeGame, setActiveGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : ['neon-serpent', 'galactic-defender'];
    } catch {
      return ['neon-serpent', 'galactic-defender'];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [cloakPreset, setCloakPreset] = useState(() => {
    return localStorage.getItem(STORAGE_CLOAK_KEY) || 'default';
  });

  // Load games from games.json on mount
  useEffect(() => {
    async function loadGamesFromJson() {
      try {
        const targetUrl = resolveUrl('games.json');
        let res = await fetch(targetUrl);
        if (!res.ok) {
          res = await fetch('./games.json');
        }
        if (res.ok) {
          const jsonGames = await res.json();
          // Merge with any custom games stored in localStorage
          const customStored = localStorage.getItem(STORAGE_CUSTOM_GAMES_KEY);
          if (customStored) {
            const parsedCustom = JSON.parse(customStored);
            // Deduplicate by ID
            const existingIds = new Set(jsonGames.map((g) => g.id));
            const newCustom = parsedCustom.filter((g) => !existingIds.has(g.id));
            setGames([...jsonGames, ...newCustom]);
          } else {
            setGames(jsonGames);
          }
        }
      } catch (err) {
        // Fallback already in place via DEFAULT_GAMES
      }
    }
    loadGamesFromJson();
  }, []);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Apply Tab Cloak title and favicon
  useEffect(() => {
    const preset = CLOAK_PRESETS.find((p) => p.id === cloakPreset);
    if (preset) {
      document.title = preset.title;
      if (preset.iconUrl) {
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = preset.iconUrl;
      }
    }
    localStorage.setItem(STORAGE_CLOAK_KEY, cloakPreset);
  }, [cloakPreset]);

  // Global Panic Key Listener (Esc or ~)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === '`' || e.key === '~') {
        setIsPanicActive((prev) => !prev);
      }
      // Quick search shortcut (/)
      if (e.key === '/' && !activeGame && !isAddModalOpen && !isJsonModalOpen) {
        const input = document.getElementById('search-input');
        if (input && document.activeElement !== input) {
          e.preventDefault();
          input.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, isAddModalOpen, isJsonModalOpen]);

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleAddGame = (newGame) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      // Save custom games in localStorage
      try {
        const existingCustom = JSON.parse(
          localStorage.getItem(STORAGE_CUSTOM_GAMES_KEY) || '[]'
        );
        localStorage.setItem(
          STORAGE_CUSTOM_GAMES_KEY,
          JSON.stringify([newGame, ...existingCustom])
        );
      } catch {}
      return updated;
    });
    setActiveGame(newGame);
  };

  const handleImportGames = (imported) => {
    setGames(imported);
    try {
      localStorage.setItem(STORAGE_CUSTOM_GAMES_KEY, JSON.stringify(imported));
    } catch {}
  };

  const handleResetDefaults = () => {
    setGames(DEFAULT_GAMES);
    localStorage.removeItem(STORAGE_CUSTOM_GAMES_KEY);
    setIsJsonModalOpen(false);
  };

  const handleRandomGame = () => {
    if (games.length === 0) return;
    const rand = games[Math.floor(Math.random() * games.length)];
    setActiveGame(rand);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Category filter
      if (activeCategory === 'Favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (activeCategory !== 'All') {
        if (game.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchDesc = game.description.toLowerCase().includes(q);
        const matchCat = game.category.toLowerCase().includes(q);
        const matchControls = game.controls.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCat || matchControls;
      }

      return true;
    });
  }, [games, activeCategory, searchQuery, favorites]);

  // Featured game for spotlight
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0] || null;
  }, [games]);

  const categories = ['All', 'Arcade', 'Action', 'Puzzle', 'Sports', 'Favorites'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Panic Disguise Screen */}
      {isPanicActive && <PanicScreen onDismiss={() => setIsPanicActive(false)} />}

      {/* Navigation Header */}
      <Header
        activeNav={activeGame ? 'playing' : activeCategory === 'Favorites' ? 'favorites' : 'all'}
        onSelectNav={(nav) => {
          if (nav === 'all') {
            setActiveGame(null);
            setActiveCategory('All');
          } else if (nav === 'favorites') {
            setActiveGame(null);
            setActiveCategory('Favorites');
          } else if (nav === 'add') {
            setIsAddModalOpen(true);
          } else if (nav === 'json') {
            setIsJsonModalOpen(true);
          } else if (nav === 'cloak') {
            setIsCloakModalOpen(true);
          }
        }}
        onRandomGame={handleRandomGame}
        favoritesCount={favorites.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeGame ? (
          /* Active Game Iframe View */
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            onSelectGame={(g) => {
              setActiveGame(g);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            allGames={games}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          /* Catalogue Hub View */
          <div>
            {/* Featured Hero Banner */}
            {searchQuery === '' && activeCategory === 'All' && (
              <HeroSpotlight
                featuredGame={featuredGame}
                onPlayGame={(g) => {
                  setActiveGame(g);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                totalGames={games.length}
              />
            )}

            {/* Filter Toolbar & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count =
                    cat === 'All'
                      ? games.length
                      : cat === 'Favorites'
                      ? favorites.length
                      : games.filter((g) => g.category.toLowerCase() === cat.toLowerCase()).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-sky-400 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      {cat === 'Favorites' && <Heart className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />}
                      <span>{cat}</span>
                      <span className={`text-[11px] tabular-nums ${isActive ? 'text-slate-900/80 font-bold' : 'text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games, controls... (/)"
                  className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Games Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  {activeCategory === 'All'
                    ? 'All Unblocked Titles'
                    : `${activeCategory} Games`}
                  <span className="text-slate-500 font-normal ml-2 tabular-nums">
                    ({filteredGames.length} available)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Embed New Iframe</span>
                  </button>
                </div>
              </div>

              {filteredGames.length === 0 ? (
                /* Empty state */
                <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    🔍
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">No games found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      No matching titles found for "{searchQuery}". Try searching for another category or embed your own game.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('All');
                      }}
                      className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 text-xs font-semibold bg-sky-400 hover:bg-sky-300 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Game</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Responsive Game Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={(g) => {
                        setActiveGame(g);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Helper Strip */}
            <div className="mt-14 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>Iframe JSON Architecture</span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Every game in this catalogue is defined inside a pure JSON file as a standard HTML5 iframe tag. You can export, modify, or add your own web games anytime.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsJsonModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>View games.json</span>
                </button>
                <button
                  onClick={() => setIsCloakModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Tab Cloak</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Nova Arcade</span>
            <span aria-hidden="true">·</span>
            <span>JSON Iframe Games Portal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              Export JSON
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              Stealth Cloaking
            </button>
            <span aria-hidden="true">·</span>
            <span>Panic Key: [Esc]</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onResetDefaults={handleResetDefaults}
      />

      <TabCloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activePreset={cloakPreset}
        onSelectPreset={setCloakPreset}
      />
    </div>
  );
}
