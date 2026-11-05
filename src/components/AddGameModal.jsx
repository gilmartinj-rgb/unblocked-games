import React, { useState } from 'react';
import { X, Plus, Eye, Code, AlertCircle } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('Arrow Keys to move · Space to action');
  const [author, setAuthor] = useState('Community');
  const [iframeCode, setIframeCode] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Format into standard iframe tag if user enters bare URL
  const sanitizeIframe = (input, gameTitle) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('<iframe')) {
      return trimmed;
    }
    // Bare URL entered
    return `<iframe src="${trimmed}" title="${gameTitle || 'Custom Game'}" width="100%" height="100%" allow="fullscreen; autoplay; gamepad" frameborder="0"></iframe>`;
  };

  const getPreviewSrc = (input) => {
    const match = input.match(/src=["'](.*?)["']/);
    if (match && match[1]) return match[1];
    return input.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeCode.trim()) {
      setError('Please provide an iframe embed tag or URL.');
      return;
    }

    const formattedIframe = sanitizeIframe(iframeCode, title);
    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom user embedded HTML5 game.',
      controls: controls.trim() || 'Keyboard and mouse controls',
      author: author.trim() || 'Custom Embed',
      rating: 5.0,
      plays: 1,
      thumbnail: thumbnail.trim(),
      accentColor: '#38bdf8',
      iframe: formattedIframe
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setIframeCode('');
    setThumbnail('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Game to JSON</h2>
              <p className="text-xs text-slate-400">Embed any HTML5 game iframe into your unblocked hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Game Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Astro Blaster"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
                <option value="Strategy">Strategy</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Iframe Embed Code or URL *
              </label>
              {iframeCode && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? 'Hide Preview' : 'Preview Iframe'}</span>
                </button>
              )}
            </div>
            <textarea
              required
              rows={3}
              value={iframeCode}
              onChange={(e) => setIframeCode(e.target.value)}
              placeholder='<iframe src="https://..." width="100%" height="100%"></iframe> or https://...'
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              You can paste full &lt;iframe&gt; HTML or a direct game URL. It will be stored in JSON as an iframe tag.
            </p>
          </div>

          {/* Live Preview Container */}
          {showPreview && iframeCode && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Iframe Live Preview</span>
                <span className="text-[10px] text-emerald-400">Sandbox Ready</span>
              </div>
              <div className="w-full h-48 bg-black rounded-lg overflow-hidden border border-slate-800">
                <iframe
                  src={getPreviewSrc(iframeCode)}
                  title="Game Preview"
                  className="w-full h-full border-0"
                  allow="fullscreen; autoplay"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of gameplay and objective"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Controls Guide
              </label>
              <input
                type="text"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                placeholder="e.g. Arrow keys to steer, Space to shoot"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Thumbnail URL (Optional)
              </label>
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://... image link"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Add Game</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
