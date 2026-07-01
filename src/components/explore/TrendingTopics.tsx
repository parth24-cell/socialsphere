import React from "react";
import { TrendingUp } from "lucide-react";

type TrendingTopicsProps = {
  topics?: string[];
  onTopicClick: (topic: string) => void;
};

const DEFAULT_TOPICS = [
  "ArtificialIntelligence",
  "Photography",
  "DesignSystems",
  "SaaS",
  "Web3",
  "Fitness",
  "Minimalism",
  "Travel"
];

export function TrendingTopics({
  topics = DEFAULT_TOPICS,
  onTopicClick
}: TrendingTopicsProps) {
  return (
    <div className="space-y-3 px-6 select-none">
      <div className="flex items-center gap-1.5 text-white/40">
        <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
        <h4 className="text-[10px] uppercase tracking-wider font-bold">Trending Conversations</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicClick(`#${topic}`)}
            className="px-3.5 py-2 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white text-white/70 rounded-xl text-xs font-semibold transition active:scale-95"
          >
            #{topic}
          </button>
        ))}
      </div>
    </div>
  );
}
