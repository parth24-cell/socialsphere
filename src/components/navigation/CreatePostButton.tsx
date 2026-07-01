"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ComposePost from "@/components/ComposePost";

interface CreatePostButtonProps {
  className?: string;
  isMobile?: boolean;
}

export function CreatePostButton({ className = "", isMobile = false }: CreatePostButtonProps) {
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={`fixed bottom-[90px] right-4 z-50 group flex items-center justify-center transition-all duration-300 outline-none ${className}`}>
          <div className="relative flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] active:scale-95 transition-all overflow-hidden">
            <Plus className="w-6 h-6 absolute group-hover:rotate-90 transition-transform duration-300" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-xl p-0 sm:p-4 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Create Post</DialogTitle>
          <div className="bg-background border border-white/10 rounded-3xl p-4 shadow-2xl">
            <ComposePost onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`group relative w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary ${className}`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        
        <Plus className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
        <span className="relative z-10 tracking-wide">Create Post</span>
      </DialogTrigger>
      <DialogContent className="max-w-xl p-0 sm:p-4 border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Create Post</DialogTitle>
        <div className="bg-background border border-white/10 rounded-3xl p-4 shadow-2xl">
          <ComposePost onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
