import React from "react";
import { Calendar, X } from "lucide-react";
import type { CarePlanItem } from "@/types/diagnosis";

interface CarePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  carePlan: CarePlanItem[];
}

export const CarePlanModal: React.FC<CarePlanModalProps> = ({
  isOpen,
  onClose,
  carePlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121a16] border border-emerald-500/30 rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>7-Day Crop Care & Spray Schedule</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {carePlan.map((item) => (
            <div
              key={item.day}
              className="bg-black/30 border-l-4 border-emerald-500 rounded-r-xl p-3 flex items-start gap-3"
            >
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-heading font-extrabold text-[10px] whitespace-nowrap">
                Day {item.day}
              </span>
              <div>
                <h5 className="font-bold text-xs text-white mb-0.5">{item.title}</h5>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
        >
          Close Schedule
        </button>
      </div>
    </div>
  );
};
