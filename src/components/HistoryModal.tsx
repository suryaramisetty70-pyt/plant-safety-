import React from "react";
import { Clock, X, Trash2 } from "lucide-react";
import type { ScanHistory } from "@/types/plant";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistory[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121a16] border border-emerald-500/30 rounded-2xl w-full max-w-lg p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Saved Scan History</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2 mb-4">
          {history.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No past plant scans saved yet.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-black/30 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-emerald-500/50 transition cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-xs text-white">
                    {item.crop} — <span className="text-emerald-400">{item.disease}</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">{item.scannedAt}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.confidence}% Conf.
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-600/30 text-xs font-semibold hover:bg-rose-600 hover:text-white transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
