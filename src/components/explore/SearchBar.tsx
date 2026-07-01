"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, CornerDownLeft, Clock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  initialQuery?: string;
  onSearchChange?: (q: string) => void;
  placeholder?: string;
};

export function SearchBar({
  initialQuery = "",
  onSearchChange,
  placeholder = "Search creators, posts, and topics..."
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Handle click outside to close recents dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    // Log to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));

    setShowRecent(false);
    
    // Route to search page
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRecentClick = (q: string) => {
    setQuery(q);
    if (onSearchChange) onSearchChange(q);
    
    // Move to front
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
    setShowRecent(false);
    
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleClearRecent = (q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== q);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  return (
    <div ref={containerRef} className="relative w-full z-30 select-none">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setShowRecent(true)}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-amber-500 rounded-2xl py-3.5 pl-11 pr-16 text-xs text-white outline-none transition-all placeholder:text-white/30"
        />
        <Search className="w-4 h-4 absolute left-4 top-4 text-white/40" />
        
        {/* Enter key tag visual helper */}
        <div className="absolute right-4 top-3.5 flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-white/30 text-[8px] uppercase tracking-wider font-extrabold">
          <span>Search</span>
          <CornerDownLeft className="w-2 h-2" />
        </div>
      </form>

      {/* Spotlight Recent Searches Dropdown */}
      {showRecent && (recentSearches.length > 0 || query.trim() !== "") && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in duration-200">
          
          {query.trim() !== "" ? (
            <div 
              onClick={() => handleSearchSubmit()}
              className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer text-xs text-white/80 group"
            >
              <Search className="w-4 h-4 text-amber-500 group-hover:scale-105 transition-transform" />
              <span>Search for <span className="text-white font-bold font-mono">"{query}"</span></span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/30 font-bold">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> Recent Searches</span>
              </div>
              {recentSearches.map((q) => (
                <div
                  key={q}
                  onClick={() => handleRecentClick(q)}
                  className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl cursor-pointer text-xs text-white/80 group"
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-white/20 group-hover:text-amber-500 transition-colors" />
                    <span className="truncate">{q}</span>
                  </span>
                  <button
                    onClick={(e) => handleClearRecent(q, e)}
                    className="p-1 hover:bg-white/10 rounded text-white/30 hover:text-red-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
