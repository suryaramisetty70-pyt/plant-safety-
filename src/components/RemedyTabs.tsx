import React, { useState } from "react";
import { Stethoscope, Leaf, FlaskConical, ShieldCheck, ShieldAlert, Hourglass, Mitten } from "lucide-react";
import type { Treatment } from "@/types/diagnosis";
import { TRANSLATIONS } from "@/i18n/translations";

interface RemedyTabsProps {
  treatments: Treatment[];
  prevention: string[];
  language: string;
}

export const RemedyTabs: React.FC<RemedyTabsProps> = ({
  treatments,
  prevention,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<"immediate" | "organic" | "chemical" | "prevention">("immediate");

  const immediate = treatments.filter((tr) => tr.category === "immediate");
  const organic = treatments.filter((tr) => tr.category === "organic");
  const chemical = treatments.filter((tr) => tr.category === "chemical");

  return (
    <div className="mt-4">
      {/* Tab Header Buttons */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("immediate")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "immediate"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>{t.immediateAction}</span>
        </button>

        <button
          onClick={() => setActiveTab("organic")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "organic"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>{t.organicFixes}</span>
        </button>

        <button
          onClick={() => setActiveTab("chemical")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "chemical"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{t.chemicalRemedies}</span>
        </button>

        <button
          onClick={() => setActiveTab("prevention")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "prevention"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.prevention}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-4">
        {/* Immediate Tab */}
        {activeTab === "immediate" && (
          <div className="space-y-3">
            {immediate.length === 0 ? (
              <p className="text-xs text-slate-400">No immediate actions required.</p>
            ) : (
              immediate.map((tr) => (
                <div key={tr.id} className="bg-black/30 border-l-4 border-emerald-500 rounded-r-lg p-3">
                  <h5 className="font-bold text-sm text-slate-100 mb-1">{tr.title}</h5>
                  <p className="text-xs text-slate-300 mb-2">{tr.description}</p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {tr.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {/* Organic Tab */}
        {activeTab === "organic" && (
          <div className="space-y-3">
            {organic.length === 0 ? (
              <p className="text-xs text-slate-400">No organic remedies listed.</p>
            ) : (
              organic.map((tr) => (
                <div key={tr.id} className="bg-black/30 border-l-4 border-emerald-500 rounded-r-lg p-3">
                  <h5 className="font-bold text-sm text-slate-100 mb-1">{tr.title}</h5>
                  <p className="text-xs text-slate-300 mb-2">{tr.description}</p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {tr.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chemical Tab with Safety Hazard Badges */}
        {activeTab === "chemical" && (
          <div className="space-y-3">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 mb-3">
              <span className="text-xs font-bold text-amber-400 block mb-1">
                ⚠️ Pesticide Safety Badges:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Mitten className="w-3 h-3" /> PPE Gloves & Mask Required
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Spray at Dusk (Bee Protection)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Hourglass className="w-3 h-3" /> 7-Day Pre-Harvest Wait (PHI)
                </span>
              </div>
            </div>

            {chemical.length === 0 ? (
              <p className="text-xs text-slate-400">No chemical sprays required for healthy crop.</p>
            ) : (
              chemical.map((tr) => (
                <div key={tr.id} className="bg-black/30 border-l-4 border-amber-500 rounded-r-lg p-3">
                  <h5 className="font-bold text-sm text-slate-100 mb-1">{tr.title}</h5>
                  <p className="text-xs text-slate-300 mb-2">{tr.description}</p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {tr.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {/* Prevention Tab */}
        {activeTab === "prevention" && (
          <div className="space-y-2">
            {prevention.map((pr, i) => (
              <div key={i} className="bg-black/30 border-l-4 border-emerald-500 rounded-r-lg p-3 text-xs text-slate-300">
                {pr}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
