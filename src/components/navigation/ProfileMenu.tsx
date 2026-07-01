"use client";

import { LogOut, Settings, User, Moon, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface ProfileMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const fallback = user?.name?.charAt(0).toUpperCase() || "U";
  const username = user?.username || user?.email?.split("@")[0] || "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative w-10 h-10 rounded-full outline-none ring-offset-background transition-all hover:ring-2 hover:ring-primary/50 focus:ring-2 focus:ring-primary">
        <Avatar className="w-full h-full border border-white/10">
          <AvatarImage src={user.image || ""} alt={user.name || "Profile"} />
          <AvatarFallback className="bg-white/5 text-white">
            {fallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 mt-2 bg-background/80 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl p-1">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{username}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-white/10 mx-2" />
        
        <div className="p-1 space-y-0.5">
          <Link href={`/${username}`}>
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 transition-colors">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/settings/security">
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 transition-colors">
              <Shield className="mr-2 h-4 w-4" />
              <span>Security</span>
            </DropdownMenuItem>
          </Link>
        </div>
        
        <DropdownMenuSeparator className="bg-white/10 mx-2" />
        
        <div className="p-1 space-y-0.5">
          <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/5 focus:bg-white/5 transition-colors">
            <User className="mr-2 h-4 w-4" />
            <span>Switch Account</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="cursor-pointer rounded-xl text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 transition-colors"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
