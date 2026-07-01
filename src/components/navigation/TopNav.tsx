"use client";

import Link from "next/link";
import { NotificationCenter } from "./NotificationCenter";
import { ProfileMenu } from "./ProfileMenu";
import { CommandPalette } from "./CommandPalette";

interface TopNavProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

export function TopNav({ user }: TopNavProps) {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-gradient-to-b from-background/90 to-background/0 backdrop-blur-md px-5 py-4 flex items-center justify-between">
      <Link href="/home" className="text-xl font-bold font-heading tracking-tight text-white hover:opacity-90 transition-opacity">
        SocialSphere
      </Link>
      
      <div className="flex items-center gap-3">
        <CommandPalette />
        <NotificationCenter />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
