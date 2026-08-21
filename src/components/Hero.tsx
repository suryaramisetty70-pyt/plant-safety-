import React from "react";
import { Sparkles, CloudSunRain, AlertTriangle } from "lucide-react";
import { TRANSLATIONS } from "@/i18n/translations";

interface HeroProps {
  language: string;
}

export const Hero: React.FC<HeroProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <section className="text-center py-6 px-4 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>100% Free AI Plant Pathology & Agronomy Engine</span>
      </div>

      <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-3 text-white">
        {t.heroTitle}
      </h2>

      <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">
        {t.heroSubtitle}
      </p>

      {/* Agri-Weather & Risk Alert Widget */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900/60 to-slate-900/60 border border-amber-500/30 rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <CloudSunRain className="w-7 h-7 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
              {t.weatherAlert}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100">
              {t.weatherText}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t.weatherAdvice}</span>
        </div>
      </div>
    </section>
  );
};
