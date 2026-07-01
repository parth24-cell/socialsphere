"use client";

import { useState } from "react";
import { Bell, Heart, UserPlus, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (open) setHasUnread(false);
    }}>
      <DropdownMenuTrigger className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary shadow-inner">
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[340px] mt-2 p-0 overflow-hidden bg-background/80 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <span className="font-semibold text-white">Notifications</span>
          <Link href="/notifications" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            View all
          </Link>
        </div>
        
        <div className="max-h-[350px] overflow-y-auto p-2">
          {/* Today Group */}
          <div className="mb-4">
            <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today</h4>
            
            <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 flex gap-3 items-start transition-colors">
              <div className="p-2 bg-primary/20 text-primary rounded-full shrink-0 shadow-inner">
                <Heart className="w-4 h-4 fill-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Alex</span> liked your post
                </p>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 ml-auto shrink-0 shadow-[0_0_5px_rgba(var(--primary),0.5)]" />
            </DropdownMenuItem>
          </div>

          {/* Yesterday Group */}
          <div>
            <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Yesterday</h4>
            
            <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 flex gap-3 items-start transition-colors">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-full shrink-0 shadow-inner">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Sarah</span> followed you
                </p>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 flex gap-3 items-start transition-colors">
              <div className="p-2 bg-green-500/20 text-green-400 rounded-full shrink-0 shadow-inner">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Mike</span> commented on your photo
                </p>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
