import React from "react";
import { Telescope } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  suggestedQueries?: string[];
  onQueryClick?: (query: string) => void;
};

export function EmptyState({
  title,
  description,
  icon,
  suggestedQueries = [],
  onQueryClick
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-md">
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-amber-500 mb-4 hover:scale-105 active:scale-95 transition-transform duration-300">
        {icon || <Telescope className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-white font-heading">{title}</h3>
      <p className="text-sm text-white/40 max-w-sm mt-1 leading-relaxed">{description}</p>
      
      {suggestedQueries.length > 0 && onQueryClick && (
        <div className="mt-8 space-y-2.5">
          <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedQueries.map(q => (
              <button
                key={q}
                onClick={() => onQueryClick(q)}
                className="px-3.5 py-2 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white rounded-xl text-xs font-semibold text-white/60 transition active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
