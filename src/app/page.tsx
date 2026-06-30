"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { LivingSphere } from "@/components/landing/LivingSphere";
import { Loader } from "@/components/landing/Loader";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] overflow-x-hidden font-sans selection:bg-[#4F46E5]/30">
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      
      <Navbar />
      
      {/* Background 3D Engine */}
      <LivingSphere />
      
      <main className="relative z-10 flex flex-col">
        <Hero isLoaded={isLoaded} />
        <Features />
        {/* Keeping CTA and Footer, but they will sit at the bottom naturally */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
