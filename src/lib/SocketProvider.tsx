"use client";

import { useEffect, ReactNode } from "react";
import { socket } from "./socket";
import { useSession } from "next-auth/react";

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      socket.connect();
      socket.emit("join", session.user.id);
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [session, status]);

  return <>{children}</>;
}
