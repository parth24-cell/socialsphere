"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bell, Mail, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./CommandPalette";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationCenter } from "./NotificationCenter";
import { CreatePostButton } from "./CreatePostButton";

import { motion } from "framer-motion";

interface DesktopSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

export function DesktopSidebar({ user }: DesktopSidebarProps) {
  const pathname = usePathname();
  const username = user?.username || user?.email?.split("@")[0] || "user";

  const links = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/messages", icon: Mail, label: "Messages" },
    { href: `/${username}`, icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="hidden md:flex p-6 h-screen sticky top-0">
      <aside className="flex flex-col w-[260px] h-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl px-5 py-8">
        <Link href="/home" className="text-3xl font-bold font-heading tracking-tight text-white mb-8 px-2 hover:opacity-90 transition-opacity">
          SocialSphere
        </Link>
        
        <div className="mb-6">
          <CommandPalette />
        </div>

        <nav className="flex-1 space-y-1.5 relative">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/home" && pathname.startsWith(link.href + "/"));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group z-10",
                  isActive 
                    ? "text-white font-semibold" 
                    : "text-slate-300 hover:text-white font-medium"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute inset-0 bg-white/10 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <link.icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive 
                    ? "text-primary scale-110" 
                    : "text-slate-400 group-hover:text-slate-200 group-hover:scale-110 group-hover:-translate-y-0.5"
                )} />
                <span className="text-[16px] tracking-wide">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto space-y-6">
          <CreatePostButton className="w-full shadow-[0_0_30px_rgba(var(--primary),0.15)] group-hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-shadow" />
          
          <div className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10 group">
            <ProfileMenu user={user} />
            <div className="flex-1 min-w-0 flex flex-col justify-center transition-transform group-hover:translate-x-1">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{username}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
