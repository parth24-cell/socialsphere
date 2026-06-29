import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import NotificationsList from "./NotificationsList";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: { id: true, profile: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <main className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
            </Link>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Notifications</h1>
          </div>
          {notifications.some((n: any) => !n.readAt) && <MarkAllAsReadButton />}
        </div>

        <NotificationsList initialData={notifications} />

      </main>
    </div>
  );
}
