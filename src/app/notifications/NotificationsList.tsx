"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { UserPlus, Heart, MessageCircle, Trash2, Loader2, Mail } from "lucide-react";
import { getNotifications, deleteNotification, getNotificationTargetUrl, markAsRead } from "@/actions/notification";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NotificationsList({ initialData }: { initialData: any[] }) {
  const [notifications, setNotifications] = useState(initialData);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length === 20);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when filter changes
    const fetchFiltered = async () => {
      setLoading(true);
      const data = await getNotifications(undefined, filter);
      setNotifications(data);
      setHasMore(data.length === 20);
      setLoading(false);
    };
    fetchFiltered();
  }, [filter]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const cursor = notifications[notifications.length - 1]?.id;
    const more = await getNotifications(cursor, filter);
    if (more.length < 20) {
      setHasMore(false);
    }
    setNotifications((prev) => [...prev, ...more]);
    setLoading(false);
  }, [loading, hasMore, notifications, filter]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);



  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      await deleteNotification(id);
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleNotificationClick = async (e: React.MouseEvent, notification: any) => {
    e.preventDefault();
    if (navigatingId) return;
    
    try {
      setNavigatingId(notification.id);
      if (!notification.readAt) {
        await markAsRead(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, readAt: new Date() } : n));
      }
      
      const target = await getNotificationTargetUrl(notification.id);
      
      if (target.error) {
        toast.error(target.error);
        return;
      }
      
      if (target.url) {
        router.push(target.url);
      }
    } catch (err) {
      toast.error("An error occurred while opening notification");
    } finally {
      setNavigatingId(null);
    }
  };

  const filters = ["ALL", "FOLLOW", "LIKE", "COMMENT", "MESSAGE"];

  return (
    <div>
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
              filter === f 
                ? "bg-indigo-600 text-white" 
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {notifications.length === 0 && !loading ? (
          <div className="text-center py-10 text-zinc-500">No notifications found.</div>
        ) : (
          notifications.map((notification: any) => {
            let Icon = UserPlus;
            let iconColor = "text-indigo-500";
            let message = "interacted with you";
            if (notification.type === "FOLLOW") {
              Icon = UserPlus;
              iconColor = "text-indigo-500";
              message = "followed you";
            } else if (notification.type === "LIKE") {
              Icon = Heart;
              iconColor = "text-pink-500";
              message = "liked your post";
            } else if (notification.type === "COMMENT") {
              Icon = MessageCircle;
              iconColor = "text-blue-500";
              message = "commented on your post";
            } else if (notification.type === "MESSAGE") {
              Icon = Mail;
              iconColor = "text-emerald-500";
              message = "sent you a message";
            }

            return (
              <div key={notification.id} className={`group flex items-center relative ${
                !notification.readAt ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
              }`}>
                <div
                  onClick={(e) => handleNotificationClick(e, notification)}
                  className="flex-1 block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition cursor-pointer"
                >
                  <div className="flex gap-4 items-center">
                    <div className={`mt-1 ${iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-zinc-900 dark:text-zinc-100">
                        <span className="font-bold">{notification.actor.displayName || notification.actor.username}</span>{" "}
                        {message}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    {navigatingId === notification.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-400 ml-auto" />
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, notification.id)}
                  className="p-3 text-zinc-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 absolute right-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
        
        {loading && (
          <div className="py-6 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        )}
        
        {/* Intersection trigger */}
        <div ref={loadMoreRef} className="h-4" />
      </div>
    </div>
  );
}
