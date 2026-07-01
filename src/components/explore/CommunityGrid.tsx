"use client";

import React, { useState } from "react";
import { Compass, Flame, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

type CommunityItem = {
  id: string;
  name: string;
  description: string;
  members: number;
  active: boolean;
  category: string;
};

const DEFAULT_COMMUNITIES: CommunityItem[] = [
  {
    id: "c-1",
    name: "Design Engineers",
    description: "Conversations at the intersection of design, typography, and frontend engineering systems.",
    members: 1420,
    active: true,
    category: "Design"
  },
  {
    id: "c-2",
    name: "AI Frontiers",
    description: "Discussions on agentic workflows, deep learning models, LLMs, and future technologies.",
    members: 3150,
    active: true,
    category: "Technology"
  },
  {
    id: "c-3",
    name: "Minimalist Creators",
    description: "Curated portfolio highlights, luxury restraint concepts, and minimal web design showcases.",
    members: 890,
    active: false,
    category: "Art"
  },
  {
    id: "c-4",
    name: "SaaS Builders",
    description: "Building indie startups, validation strategies, bootstrapping, and scaling software products.",
    members: 2040,
    active: false,
    category: "Business"
  }
];

export function CommunityGrid() {
  const [joinedList, setJoinedList] = useState<string[]>([]);

  const handleToggleJoin = (id: string, name: string) => {
    const joined = joinedList.includes(id);
    if (joined) {
      setJoinedList(prev => prev.filter(x => x !== id));
      toast.info(`Left community: #${name}`);
    } else {
      setJoinedList(prev => [...prev, id]);
      toast.success(`Joined community: #${name}!`);
    }
  };

  return (
    <div className="space-y-3 px-6 select-none">
      <div className="flex items-center gap-1.5 text-white/40">
        <Compass className="w-3.5 h-3.5 text-amber-500" />
        <h4 className="text-[10px] uppercase tracking-wider font-bold">Suggested Destinations</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {DEFAULT_COMMUNITIES.map((c) => {
          const isJoined = joinedList.includes(c.id);
          return (
            <div
              key={c.id}
              className="p-5 bg-white/[0.01] border border-white/5 rounded-3xl hover:border-white/10 hover:bg-white/[0.015] transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Active hot indicator */}
              {c.active && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-lg">
                  <Flame className="w-3 h-3 text-amber-500" /> Hot
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-white/30 block">
                  {c.category}
                </span>
                <h5 className="font-bold text-white text-sm hover:underline cursor-pointer">
                  {c.name}
                </h5>
                <p className="text-[11px] text-white/40 leading-relaxed pr-6">
                  {c.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5">
                <span className="text-[10px] text-white/30 font-medium">
                  {c.members + (isJoined ? 1 : 0)} Members
                </span>
                <button
                  onClick={() => handleToggleJoin(c.id, c.name)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center gap-1 ${
                    isJoined
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80 hover:text-white"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3 h-3" /> Joined
                    </>
                  ) : (
                    "Join"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
