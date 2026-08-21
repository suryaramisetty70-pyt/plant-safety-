import React from "react";
import { Leaf, Globe, FlaskConical, Calculator, Clock, Key } from "lucide-react";
import { TRANSLATIONS } from "@/i18n/translations";

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  onOpenSoilWizard: () => void;
  onOpenDosageCalc: () => void;
  onOpenHistory: () => void;
  onOpenApiModal: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenSoilWizard,
  onOpenDosageCalc,
  onOpenHistory,
  onOpenApiModal,
  historyCount
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0f0d]/85 border-b border-emerald-500/20 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_20px_rgba(46,204,113,0.35)]">
            <Leaf className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl tracking-tight text-white">
              PlantDoctor<span className="text-emerald-400">.AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Smart Crop Diagnostic Engine
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-black/40 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-slate-100 outline-none cursor-pointer font-sans"
            >
              <option value="en" className="bg-[#121a16] text-white">English</option>
              <option value="te" className="bg-[#121a16] text-white">తెలుగు (Telugu)</option>
              <option value="hi" className="bg-[#121a16] text-white">हिंदी (Hindi)</option>
              <option value="ta" className="bg-[#121a16] text-white">தமிழ் (Tamil)</option>
              <option value="es" className="bg-[#121a16] text-white">Español (Spanish)</option>
            </select>
          </div>

          <button
            onClick={onOpenSoilWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 hover:border-emerald-400 transition"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.soilWizard}</span>
          </button>

          <button
            onClick={onOpenDosageCalc}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 hover:border-emerald-400 transition"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.dosageCalc}</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 hover:border-emerald-400 transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.history}</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-bold">
              {historyCount}
            </span>
          </button>

          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 hover:border-emerald-400 transition"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.apiSettings}</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
              Active
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
