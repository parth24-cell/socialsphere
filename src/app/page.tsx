import { Navbar } from "@/components/landing/Navbar";
import { Lamp } from "@/components/landing/Lamp";
import { Particles } from "@/components/landing/Particles";
import { Spotlight } from "@/components/landing/Spotlight";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { LivePreview } from "@/components/landing/LivePreview";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-indigo-500/30">
      <Spotlight />
      <Particles />
      <Navbar />
      
      <main className="relative z-10 flex flex-col">
        {/* Lamp is placed at the top of the main content */}
        <Lamp />
        <Hero />
        <Features />
        <LivePreview />
        <Stats />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
