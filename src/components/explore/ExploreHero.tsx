import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export function ExploreHero() {
  return (
    <div className="px-6 select-none">
      <div className="relative w-full h-52 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden group">
        {/* Curated background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent opacity-60 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

        {/* Content */}
        <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-xl">
            <Sparkles className="w-2.5 h-2.5" /> Curated Today
          </span>
          <h2 className="text-lg font-bold text-white font-heading tracking-tight leading-tight max-w-sm sm:text-xl">
            How Design Systems Scale: The Luxury of Restraint
          </h2>
          <p className="text-xs text-white/50 leading-relaxed line-clamp-1 max-w-md">
            Explore why the world's most premium brands prioritize breathing room over content density.
          </p>
        </div>

        {/* View indicator */}
        <div className="absolute top-6 right-6 p-2.5 bg-white/5 border border-white/10 hover:border-amber-500/20 hover:text-amber-500 rounded-xl transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 cursor-pointer">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
