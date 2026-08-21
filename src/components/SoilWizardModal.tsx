import React, { useState } from "react";
import { FlaskConical, X } from "lucide-react";
import { analyzeSoilSymptom } from "@/api/soilApi";
import type { NutrientDiagnosis } from "@/types/soil";

interface SoilWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoilWizardModal: React.FC<SoilWizardModalProps> = ({ isOpen, onClose }) => {
  const [crop, setCrop] = useState("tomato");
  const [symptom, setSymptom] = useState("n_def");
  const [diagnosis, setDiagnosis] = useState<NutrientDiagnosis | null>(null);

  if (!isOpen) return null;

  const handleDiagnose = async () => {
    const result = await analyzeSoilSymptom(crop, symptom);
    setDiagnosis(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121a16] border border-emerald-500/30 rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <span>Soil NPK & Nutrient Wizard</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          No photo? Select observed crop leaf symptoms to diagnose soil nutrient deficiencies:
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Crop Type:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="tomato">Tomato / Solanum</option>
              <option value="corn">Maize / Corn</option>
              <option value="rice">Rice / Paddy</option>
              <option value="apple">Apple Orchard</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Observed Symptom Pattern:
            </label>
            <select
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="n_def">Uniform yellowing starting from lower older leaves (Nitrogen N)</option>
              <option value="p_def">Dark green leaves with purple/reddish undersides (Phosphorus P)</option>
              <option value="k_def">Burnt, scorched leaf margins and tips (Potassium K)</option>
              <option value="ca_def">Blossom end rot on bottom of fruits (Calcium Ca)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleDiagnose}
          className="w-full py-2.5 bg-emerald-500 text-slate-950 font-heading font-bold text-xs rounded-xl hover:bg-emerald-400 transition mb-4"
        >
          Diagnose Soil Deficiency
        </button>

        {diagnosis && (
          <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3 text-left">
            <h4 className="font-heading font-bold text-sm text-emerald-400 mb-1">
              {diagnosis.nutrientName}
            </h4>
            <p className="text-xs text-slate-300 mb-2">{diagnosis.description}</p>
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Recommended Action:</span>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
              {diagnosis.recommendedAction.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
