"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Command, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const quickLinks = [
    { label: "Go to Home", href: "/home" },
    { label: "Explore Trending", href: "/explore" },
    { label: "View Messages", href: "/messages" },
    { label: "Account Settings", href: "/settings/account" },
  ];

  const recentSearches = [
    { label: "photography tips", type: "search" },
    { label: "Alex Developer", type: "user" },
    { label: "UI/UX Design Community", type: "community" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors w-64 shadow-inner"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium text-muted-foreground bg-white/10">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <Search className="w-6 h-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background/80 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <form onSubmit={handleSearch} className="flex items-center px-4 py-4 border-b border-white/10 bg-white/5">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="Search users, posts, or commands..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-lg focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] font-medium text-muted-foreground bg-white/10">
              ESC
            </kbd>
          </form>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query ? (
              <div className="py-2 space-y-6">
                
                {/* Recent Searches Section */}
                <div>
                  <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Recent
                  </p>
                  {recentSearches.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(item.label);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 rounded-xl hover:bg-white/5 hover:text-white transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quick Actions Section */}
                <div>
                  <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Quick Actions
                  </p>
                  {quickLinks.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setOpen(false);
                        router.push(link.href);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 rounded-xl hover:bg-white/5 hover:text-white transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <Command className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        {link.label}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                {/* Simulated Loading/Empty State */}
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Searching for "{query}"...</p>
                <p className="text-xs text-muted-foreground mt-2 opacity-70">Press Enter to view all results</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
