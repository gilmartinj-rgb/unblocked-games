import React from 'react';
import { Eye, FileText, ArrowRight } from 'lucide-react';

export const PanicScreen = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 font-sans p-8 overflow-y-auto select-text">
      {/* Google Docs style top bar */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-medium text-slate-800">
                AP World History - Unit 4: Global Interactions & Maritime Revolutions (1450–1750)
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-0.5">
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Insert</span>
                <span>Format</span>
                <span>Tools</span>
                <span className="text-slate-400">· Last edit was seconds ago</span>
              </div>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Return to unblocked games hub"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Resume Arcade</span>
          </button>
        </div>

        {/* Realistic study notes document */}
        <div className="bg-white border border-slate-200 shadow-sm rounded p-10 space-y-6 text-slate-800 leading-relaxed min-h-[800px]">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Section 4.2: Transoceanic Maritime Reconnaissance & Trade Networks
            </h2>
            <div className="text-sm text-slate-500 mt-1">Student Notes & Summary Analysis · Due Friday</div>
          </div>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">1. Key Innovations in Navigation Technology</h3>
            <p className="text-sm text-slate-700">
              Cross-cultural technological transfers significantly enhanced maritime capabilities across Eurasia and the Atlantic basin. European navigators combined Chinese inventions (such as the sternpost rudder and magnetic compass) with Middle Eastern innovations (the astrolabe and triangular lateen sail) to construct the Portuguese caravel and Spanish galleon.
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li><strong>Magnetic Compass:</strong> Originated in Han Dynasty China, allowed mariners to maintain accurate bearing in open ocean waters.</li>
              <li><strong>Astrolabe:</strong> Calculated latitude based on celestial angles, perfected by Islamic astronomers in Baghdad and Cordoba.</li>
              <li><strong>Caravel:</strong> Slender ship hull design capable of tacking into head-winds, pioneered under Prince Henry the Navigator.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">2. The Columbian Exchange and Ecological Shifts</h3>
            <p className="text-sm text-slate-700">
              The sustained contact between the Eastern and Western Hemispheres resulted in extensive biological and demographic transformations. The introduction of American staple crops (potatoes, maize, sweet potatoes, cassava) fueled major population increases in Europe, Africa, and East Asia, despite the devastating epidemics caused by Old World pathogens in the Americas.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs font-mono text-slate-600">
              Table 4.1: Intercontinental Biological Exchange Breakdown
              <br />
              Americas &rarr; Eurasia/Africa: Potatoes, Maize, Tomatoes, Tobacco, Cacao, Vanilla, Beans
              <br />
              Eurasia/Africa &rarr; Americas: Wheat, Rice, Sugarcane, Horses, Cattle, Smallpox, Measles
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">3. Mercantilism and Joint-Stock Chartered Enterprises</h3>
            <p className="text-sm text-slate-700">
              European royal courts adopted mercantilist commercial doctrines predicated on favorable balances of trade and the accumulation of precious bullion (silver and gold). To finance high-risk transoceanic ventures, private investors established chartered joint-stock entities, notably the Dutch East India Company (VOC) and the English East India Company (EIC), granting monopoly rights over designated trade corridors.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
            <span>Page 1 of 4 · Double spaced formatted</span>
            <button
              onClick={onDismiss}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Back to session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
