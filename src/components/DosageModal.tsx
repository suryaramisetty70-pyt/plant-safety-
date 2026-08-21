import React, { useState } from "react";
import { Calculator, X } from "lucide-react";
import { calculateDemoDosage } from "@/demo/dosageData";
import type { AreaUnit, DosageCalculation } from "@/types/dosage";

interface DosageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DosageModal: React.FC<DosageModalProps> = ({ isOpen, onClose }) => {
  const [area, setArea] = useState(1);
  const [unit, setUnit] = useState<AreaUnit>("acres");
  const [chemicalId, setChemicalId] = useState("mancozeb");

  if (!isOpen) return null;

  const result: DosageCalculation = calculateDemoDosage({ area, unit, chemicalId });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121a16] border border-emerald-500/30 rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>Pesticide & Water Dosage Calculator</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Calculate required water spray volume and chemical weights based on your field size:
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Farm Area Size:</label>
            <input
              type="number"
              value={area}
              min={0.1}
              step={0.5}
              onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Area Unit:</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as AreaUnit)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
              <option value="squareMeters">Square Meters</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Chemical / Treatment:</label>
            <select
              value={chemicalId}
              onChange={(e) => setChemicalId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-emerald-400"
            >
              <option value="mancozeb">Mancozeb Fungicide (2 kg/ha)</option>
              <option value="copper-oxychloride">Copper Oxychloride (2.5 kg/ha)</option>
              <option value="neem-oil">Neem Oil Spray (2.5 L/ha)</option>
              <option value="chlorothalonil">Chlorothalonil (1.5 kg/ha)</option>
            </select>
          </div>
        </div>

        <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
          <h4 className="font-heading font-bold text-xs text-emerald-400">Calculation Summary:</h4>
          <div className="flex justify-between text-xs py-1 border-b border-slate-800">
            <span className="text-slate-400">Total Spray Water Volume:</span>
            <strong className="text-white">{result.totalWaterLiters} Liters</strong>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-slate-400">Required Chemical Quantity:</span>
            <strong className="text-emerald-400 font-bold">
              {result.chemicalQuantity} {result.chemicalUnit}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
