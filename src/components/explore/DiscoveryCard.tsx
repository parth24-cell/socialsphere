import React from "react";
import { cn } from "@/lib/utils";

type DiscoveryCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function DiscoveryCard({ children, className, onClick }: DiscoveryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/[0.01] border border-white/5 rounded-3xl p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.015] hover:-translate-y-0.5",
        onClick && "cursor-pointer active:scale-99 active:translate-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}
