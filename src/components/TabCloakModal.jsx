import React from 'react';
import { X, Shield, EyeOff, Check, KeyRound } from 'lucide-react';

export const CLOAK_PRESETS = [
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    title: 'Classes',
    iconUrl: 'https://ssl.gstatic.com/classroom/favicon.png',
    description: 'Disguises tab as your school classroom portal'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    iconUrl: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    description: 'Disguises tab as your cloud Google Drive storage'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    iconUrl: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    description: 'Looks like an active essay or homework document'
  },
  {
    id: 'canvas-lms',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    iconUrl: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    description: 'Standard university & school LMS dashboard title'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    title: 'Desmos | Scientific Calculator',
    iconUrl: 'https://www.desmos.com/favicon.ico',
    description: 'Looks like an online math calculator tool'
  },
  {
    id: 'default',
    name: 'Default (Nova Arcade)',
    title: 'Nova Arcade - Unblocked Games Hub',
    iconUrl: '',
    description: 'Standard Nova Arcade gaming portal tab identity'
  }
];

export const TabCloakModal = ({
  isOpen,
  onClose,
  activePreset,
  onSelectPreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tab Cloaker & Panic Key</h2>
              <p className="text-xs text-slate-400">
                Disguise your browser tab title and favicon instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Panic Key Notice */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <KeyRound className="w-4 h-4" />
              <span>Instant Panic Camouflage</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-sky-300 font-mono text-[11px]">Esc</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-sky-300 font-mono text-[11px]">~</kbd>{' '}
              at any moment to instantly trigger a full-screen study notes disguise.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Tab Stealth Preset
            </label>
            <div className="space-y-2.5">
              {CLOAK_PRESETS.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => onSelectPreset(preset.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{preset.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-sky-400 font-normal">Active</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        Tab Title: <span className="font-mono text-slate-300">"{preset.title}"</span>
                      </div>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-slate-600">
                          <EyeOff className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
