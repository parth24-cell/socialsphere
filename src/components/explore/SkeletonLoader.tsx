import React from "react";

export function SkeletonLoader() {
  return (
    <div className="w-full animate-pulse space-y-8 px-6 py-4 select-none">
      {/* Featured Today Hero Shimmer */}
      <div className="h-52 w-full bg-white/[0.02] rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Recommended section header */}
      <div className="space-y-2">
        <div className="h-4 w-40 bg-white/[0.02] rounded-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
        <div className="h-3 w-64 bg-white/[0.02] rounded-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* Suggested People Horizontal List Shimmer */}
      <div className="flex gap-4 overflow-hidden py-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[190px] p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3 shrink-0 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] mx-auto" />
            <div className="h-3 w-24 bg-white/[0.02] rounded-md mx-auto" />
            <div className="h-2 w-16 bg-white/[0.02] rounded-md mx-auto" />
            <div className="h-7 w-full bg-white/[0.02] rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        ))}
      </div>

      {/* Community Grid Shimmer */}
      <div className="space-y-4 pt-2">
        <div className="h-4 w-48 bg-white/[0.02] rounded-md relative overflow-hidden" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="h-3 w-28 bg-white/[0.02] rounded-md" />
              <div className="h-2.5 w-full bg-white/[0.02] rounded-md" />
              <div className="h-2.5 w-2/3 bg-white/[0.02] rounded-md" />
              <div className="h-6 w-16 bg-white/[0.02] rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
