"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/50 backdrop-blur-md border-b border-white/10 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Globe className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">SocialSphere</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#community" className="hover:text-white transition-colors">Community</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/register" className="relative group overflow-hidden rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white shadow-sm border border-white/20 transition-all hover:bg-white hover:text-black">
            <span className="relative z-10">Get Started</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
