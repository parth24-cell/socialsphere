"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Pusher from "pusher-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PusherContextType {
  pusherClient: Pusher | null;
}

const PusherContext = createContext<PusherContextType>({ pusherClient: null });

export const usePusher = () => useContext(PusherContext);

export function PusherProvider({ children }: { children: ReactNode }) {
  const [pusherClient, setPusherClient] = useState<Pusher | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    // Initialize Pusher Client
    const client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    setPusherClient(client);

    // Subscribe to user's private notification channel
    // E.g. likes, mentions, follows
    const channel = client.subscribe(`user-${currentUserId}`);

    channel.bind("new-notification", (data: any) => {
      // Refresh the current route to update server components (like unread badges)
      router.refresh();

      // Show a toast based on notification type
      let message = "New notification!";
      if (data.type === "LIKE") message = "Someone liked your post.";
      if (data.type === "COMMENT") message = "Someone commented on your post.";
      if (data.type === "FOLLOW") message = "You have a new follower.";
      if (data.type === "MENTION") message = "You were mentioned.";

      if (data.actor?.profile?.displayName) {
        message = `${data.actor.profile.displayName} ${
          data.type === "LIKE"
            ? "liked your post"
            : data.type === "COMMENT"
            ? "commented on your post"
            : data.type === "FOLLOW"
            ? "started following you"
            : "mentioned you"
        }.`;
      }

      toast(message, {
        icon: "🔔",
      });
    });

    return () => {
      channel.unbind_all();
      client.unsubscribe(`user-${currentUserId}`);
      client.disconnect();
    };
  }, [currentUserId, router]);

  return (
    <PusherContext.Provider value={{ pusherClient }}>
      {children}
    </PusherContext.Provider>
  );
}
