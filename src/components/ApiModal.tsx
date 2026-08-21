import React, { useState } from "react";
import { Key, X, Save } from "lucide-react";

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("plant_doc_gemini_key") || ""
  );

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("plant_doc_gemini_key", apiKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121a16] border border-emerald-500/30 rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <span>Gemini API Settings</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          PlantDoctor AI operates seamlessly using Google Gemini Multimodal Vision API & Wikipedia Knowledge Base.
        </p>

        <div className="space-y-2 mb-4">
          <label className="text-xs font-semibold text-slate-300 block">
            Google Gemini API Key:
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your Gemini API key here"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-400"
          />
          <span className="text-[10px] text-slate-500 block">
            Get a free key at{" "}
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              aistudio.google.com
            </a>
          </span>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-emerald-500 text-slate-950 font-heading font-bold text-xs rounded-xl hover:bg-emerald-400 transition flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Key & Connect</span>
        </button>
      </div>
    </div>
  );
};
