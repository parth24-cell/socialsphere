"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TabOption = "POSTS" | "MEDIA" | "REPLIES" | "SAVED" | "ABOUT";

type ProfileTabsProps = {
  activeTab: TabOption;
  onChangeTab: (tab: TabOption) => void;
  showSaved?: boolean;
};

export function ProfileTabs({
  activeTab,
  onChangeTab,
  showSaved = false
}: ProfileTabsProps) {
  const tabs = [
    { value: "POSTS" as TabOption, label: "Posts" },
    { value: "MEDIA" as TabOption, label: "Media" },
    { value: "REPLIES" as TabOption, label: "Replies" },
    ...(showSaved ? [{ value: "SAVED" as TabOption, label: "Saved" }] : []),
    { value: "ABOUT" as TabOption, label: "About" }
  ];

  return (
    <div className="flex border-b border-white/5 text-xs select-none w-full bg-transparent px-6 sticky top-[68px] z-10 backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChangeTab(tab.value)}
            className={cn(
              "relative py-3.5 px-4 text-center font-bold uppercase tracking-wider transition-all duration-300",
              isActive ? "text-amber-500 font-extrabold" : "text-white/40 hover:text-white/70"
            )}
          >
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="profileActiveTabLine"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
