"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ActiveFeature = "messaging" | "stories" | "feed" | "communities" | "auth" | "creator" | "ai" | "cta" | null;

interface SphereContextType {
  activeFeature: ActiveFeature;
  setActiveFeature: (feature: ActiveFeature) => void;
}

const SphereContext = createContext<SphereContextType | undefined>(undefined);

export function SphereProvider({ children }: { children: ReactNode }) {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>(null);

  return (
    <SphereContext.Provider value={{ activeFeature, setActiveFeature }}>
      {children}
    </SphereContext.Provider>
  );
}

export function useSphere() {
  const context = useContext(SphereContext);
  if (context === undefined) {
    throw new Error("useSphere must be used within a SphereProvider");
  }
  return context;
}
