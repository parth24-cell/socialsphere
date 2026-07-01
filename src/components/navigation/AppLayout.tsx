"use client";

import { DesktopSidebar } from "./DesktopSidebar";
import { MobileNav } from "./MobileNav";
import { TopNav } from "./TopNav";
import { CreatePostButton } from "./CreatePostButton";

interface AppLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

export function AppLayout({ children, user }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center selection:bg-primary/30">
      <div className="w-full max-w-7xl flex flex-col md:flex-row min-h-screen md:gap-8">
        
        {/* Top Navigation for Mobile */}
        <TopNav user={user} />

        {/* Desktop Sidebar (Left) */}
        <DesktopSidebar user={user} />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 pb-28 md:pb-0 md:py-6">
          {children}
        </main>

        {/* Floating Create Post Button for Mobile */}
        <div className="md:hidden">
          <CreatePostButton isMobile={true} />
        </div>

        {/* Bottom Navigation for Mobile */}
        <MobileNav />
        
      </div>
    </div>
  );
}
