"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PusherProvider } from "@/components/PusherProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <PusherProvider>
          {children}
          <Toaster richColors position="top-right" />
        </PusherProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
