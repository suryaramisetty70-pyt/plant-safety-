import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import type { BotanicalInformation } from "@/types/plant";

interface WikipediaCardProps {
  info: BotanicalInformation | null;
  loading: boolean;
}

export const WikipediaCard: React.FC<WikipediaCardProps> = ({ info, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-800 rounded w-full mb-1" />
        <div className="h-3 bg-slate-800 rounded w-2/3" />
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950/20 to-slate-900/40 border border-blue-500/20 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
            Wikipedia Botanical Knowledge
          </span>
          <h4 className="font-heading font-bold text-sm text-slate-100">{info.title}</h4>
        </div>
      </div>

      <p className="text-xs text-slate-300 line-clamp-3 mb-2 leading-relaxed">
        {info.summary}
      </p>

      <a
        href={info.wikipediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline"
      >
        <span>Read full Wikipedia article</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
