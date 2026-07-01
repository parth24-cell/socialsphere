"use client";

import React, { useEffect } from "react";
import { SphereProvider, useSphere } from "@/components/landing/SphereContext";
import { LivingSphere } from "@/components/landing/LivingSphere";

function AuthEnvironment({ children }: { children: React.ReactNode }) {
  const { setActiveFeature } = useSphere();

  // Set the sphere to 'auth' mode on mount to trigger the "white scanner" lighting
  useEffect(() => {
    setActiveFeature("auth");
    return () => setActiveFeature(null);
  }, [setActiveFeature]);

  return (
    <div className="relative min-h-screen bg-[#020205] text-white flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-amber-500/30">
      {/* Background Sphere Animation */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <LivingSphere />
      </div>
      
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-md mx-auto p-4 sm:p-8">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
          {/* subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-[2rem]" />
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SphereProvider>
      <AuthEnvironment>
        {children}
      </AuthEnvironment>
    </SphereProvider>
  );
}
