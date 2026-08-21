import React, { useState } from "react";
import { Volume2, Calendar, Printer, AlertTriangle, Eye, Seedling } from "lucide-react";
import type { PlantDiagnosis } from "@/types/diagnosis";
import type { BotanicalInformation } from "@/types/plant";
import { WikipediaCard } from "./WikipediaCard";
import { RemedyTabs } from "./RemedyTabs";

interface DiagnosisResultsProps {
  diagnosis: PlantDiagnosis | null;
  botanicalInfo: BotanicalInformation | null;
  loadingWiki: boolean;
  language: string;
  onOpenCarePlan: () => void;
}

export const DiagnosisResults: React.FC<DiagnosisResultsProps> = ({
  diagnosis,
  botanicalInfo,
  loadingWiki,
  language,
  onOpenCarePlan
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!diagnosis) {
    return (
      <div className="bg-[#121a16]/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center min-h-[480px]">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400/50 mb-4">
          <Seedling className="w-10 h-10" />
        </div>
        <h3 className="font-heading font-bold text-lg text-slate-100 mb-1">
          No Plant Analyzed Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Select or upload a leaf photo on the left panel and click <strong>"Analyze Plant"</strong> to get instant diagnosis and remedies.
        </p>
      </div>
    );
  }

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const text = `${diagnosis.plantName}. Diagnosed condition: ${diagnosis.disease.name}. Severity: ${diagnosis.severity}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#121a16]/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 shadow-2xl flex flex-col">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/60 border border-emerald-500/30 rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide mb-1 ${
              diagnosis.severity === "healthy"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}
          >
            {diagnosis.severity === "healthy" ? "Healthy Crop" : "Infected"}
          </span>
          <h3 className="font-heading font-extrabold text-xl text-white">
            {diagnosis.plantName}
          </h3>
          <p className="text-xs italic text-slate-400">{diagnosis.scientificName}</p>
        </div>

        <div className="flex gap-2">
          <div className="bg-black/40 border border-slate-800 rounded-lg p-2 text-center min-w-[70px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Confidence</span>
            <span className="font-heading font-bold text-sm text-emerald-400">
              {Math.round(diagnosis.confidence * 100)}%
            </span>
          </div>
          <div className="bg-black/40 border border-slate-800 rounded-lg p-2 text-center min-w-[70px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Severity</span>
            <span className="font-heading font-bold text-sm text-amber-400 capitalize">
              {diagnosis.severity}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          onClick={handleSpeak}
          className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:border-emerald-400 hover:text-white transition flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isSpeaking ? "Stop Audio" : "Listen Audio"}</span>
        </button>

        <button
          onClick={onOpenCarePlan}
          className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:border-emerald-400 hover:text-white transition flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>7-Day Plan</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:border-emerald-400 hover:text-white transition flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5 text-blue-400" />
          <span>Print Report</span>
        </button>
      </div>

      {/* Wikipedia Knowledge Card */}
      <WikipediaCard info={botanicalInfo} loading={loadingWiki} />

      {/* Diagnosed Condition Box */}
      <div className="bg-black/30 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
              Diagnosed Condition / Issue
            </span>
            <h4 className="font-heading font-bold text-base text-slate-100">
              {diagnosis.disease.name}
            </h4>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1 mb-2">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            Observed Visual Symptoms:
          </h5>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
            {diagnosis.symptoms.map((sym, idx) => (
              <li key={idx}>{sym}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Remedy Tabs */}
      <RemedyTabs
        treatments={diagnosis.treatments}
        prevention={diagnosis.prevention}
        language={language}
      />
    </div>
  );
};
