"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Globe } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const links = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "Community", path: "/explore" },
    { name: "About", path: "#" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#FAFAFA] group relative z-10 overflow-hidden">
          <motion.div 
            whileHover={{ rotate: 180 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Globe className="h-6 w-6 text-[#FBBF24] transition-colors duration-500" />
          </motion.div>
          <span className="text-lg font-medium tracking-wide">SocialSphere</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center absolute inset-0 pointer-events-none">
          <nav 
            className={`pointer-events-auto flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-700 relative
              ${isScrolled 
                ? "bg-[#020205]/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-full before:pointer-events-none" 
                : "bg-transparent border border-transparent"}
            `}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {links.map((link, i) => (
              <Link
                key={link.name}
                href={link.path}
                onMouseEnter={() => setHoveredIndex(i)}
                className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <span className={`relative z-10 transition-colors duration-300 ${hoveredIndex === i ? 'text-white' : 'text-[#A1A1AA]'}`}>
                   {link.name}
                </span>
                
                {hoveredIndex === i && (
                   <motion.div
                     layoutId="navbar-hover"
                     className="absolute inset-0 bg-white/10 rounded-full"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ type: "spring", stiffness: 400, damping: 30 }}
                   />
                )}
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
          <Link
            href="/register"
            className="text-sm font-medium text-black bg-white px-4 py-2 rounded-full hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
