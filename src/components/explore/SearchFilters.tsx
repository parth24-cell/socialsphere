import React from "react";
import { cn } from "@/lib/utils";

type FilterType = "posts" | "users" | "all";

type SearchFiltersProps = {
  activeFilter: FilterType;
  onChangeFilter: (filter: FilterType) => void;
};

export function SearchFilters({
  activeFilter,
  onChangeFilter
}: SearchFiltersProps) {
  const options = [
    { value: "all" as FilterType, label: "All Results" },
    { value: "posts" as FilterType, label: "Posts" },
    { value: "users" as FilterType, label: "Creators" }
  ];

  return (
    <div className="flex gap-2 select-none px-6">
      {options.map((opt) => {
        const active = activeFilter === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChangeFilter(opt.value)}
            className={cn(
              "px-3.5 py-2 rounded-xl border text-xs font-semibold tracking-wide transition-all active:scale-95",
              active 
                ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold" 
                : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white/80"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
