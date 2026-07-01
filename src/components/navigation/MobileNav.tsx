"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bell, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/messages", icon: Mail, label: "Messages" },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-3 py-3 bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-full">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative p-3 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary tap-highlight-transparent"
              aria-label={link.label}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavActiveIndicator"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <link.icon className={cn(
                "w-6 h-6 relative z-10 transition-transform duration-300", 
                isActive ? "text-primary scale-110" : "text-white/70 active:scale-95"
              )} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
