import React from "react";

export function SkeletonLoader() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Banner Skeleton */}
      <div className="h-48 w-full bg-white/[0.02] rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="px-6 space-y-4">
        {/* Avatar & Header Buttons */}
        <div className="flex justify-between items-end">
          <div className="w-32 h-32 rounded-2xl bg-white/[0.02] border border-white/10 -mt-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="flex gap-2">
            <div className="w-24 h-9 rounded-xl bg-white/[0.02] border border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="w-24 h-9 rounded-xl bg-white/[0.02] border border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>

        {/* Profile Info Skeleton */}
        <div className="space-y-3 pt-4">
          <div className="h-6 w-48 bg-white/[0.02] rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-4 w-32 bg-white/[0.02] rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-4 w-full max-w-md bg-white/[0.02] rounded-md relative overflow-hidden pt-2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="flex gap-6 py-2">
          <div className="h-5 w-16 bg-white/[0.02] rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-5 w-20 bg-white/[0.02] rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-5 w-20 bg-white/[0.02] rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 border-b border-white/5 py-3">
          <div className="h-8 w-16 bg-white/[0.02] rounded-md relative overflow-hidden" />
          <div className="h-8 w-16 bg-white/[0.02] rounded-md relative overflow-hidden" />
          <div className="h-8 w-16 bg-white/[0.02] rounded-md relative overflow-hidden" />
        </div>

        {/* Feed Posts Skeleton */}
        <div className="space-y-6 py-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.02] relative" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-white/[0.02] rounded-md" />
                  <div className="h-3 w-20 bg-white/[0.02] rounded-md" />
                </div>
              </div>
              <div className="h-16 w-full bg-white/[0.02] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
