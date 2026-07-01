import React from "react";
import { FolderHeart } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
};

export function EmptyState({ 
  title, 
  description, 
  icon, 
  actionLabel, 
  onActionClick 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-md">
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-amber-500 mb-4 hover:scale-105 active:scale-95 transition-transform duration-300">
        {icon || <FolderHeart className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-white font-heading">{title}</h3>
      <p className="text-sm text-white/40 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      
      {actionLabel && onActionClick && (
        <button 
          onClick={onActionClick}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
