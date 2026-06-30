"use client";

import Link from "next/link";
import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030014] py-12 relative z-20">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2 text-[#FAFAFA]">
          <Globe className="h-5 w-5 text-[#4F46E5]" />
          <span className="font-medium tracking-wide">SocialSphere</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#A1A1AA]">
          <Link href="/privacy" className="hover:text-[#FAFAFA] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#FAFAFA] transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-[#FAFAFA] transition-colors">Contact</Link>
        </div>
        
        <div className="text-sm text-[#A1A1AA]">
          © {new Date().getFullYear()} SocialSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
