"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Globe } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#FAFAFA] group relative z-10">
          <Globe className="h-6 w-6 text-[#FBBF24] group-hover:text-[#F59E0B] transition-colors duration-500" />
          <span className="text-lg font-medium tracking-wide">SocialSphere</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center absolute inset-0 pointer-events-none">
          <nav 
            className={`pointer-events-auto flex items-center gap-1 rounded-full px-4 py-2 transition-all duration-500 ${
              isScrolled ? "bg-[#020205]/60 backdrop-blur-2xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : ""
            }`}
          >
            {[
              { name: "Home", path: "/" },
              { name: "Features", path: "#features" },
              { name: "Community", path: "/explore" },
              { name: "About", path: "#" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="px-4 py-2 rounded-full text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/5 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Auth Links */}
        <div className="flex items-center gap-4 relative z-10">
          <Link
            href="/login"
            className="text-sm font-medium text-[#FAFAFA] hover:text-[#F59E0B] transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
