"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { LivingSphere } from "@/components/landing/LivingSphere";
import { Loader } from "@/components/landing/Loader";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { SphereProvider } from "@/components/landing/SphereContext";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SphereProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] overflow-x-hidden font-sans selection:bg-[#F59E0B]/30">
        {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
        
        <Navbar />
        
        {/* Background 3D Engine */}
        <LivingSphere />
        
        <main className="relative z-10 flex flex-col">
          <Hero isLoaded={isLoaded} />
          <Features />
        </main>

        <Footer />
      </div>
    </SphereProvider>
  );
}
