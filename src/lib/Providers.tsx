"use client";

import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./SocketProvider";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <SocketProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SocketProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
