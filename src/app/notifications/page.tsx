import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import NotificationsList from "./NotificationsList";
import { AppLayout } from "@/components/navigation/AppLayout";

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
    <AppLayout user={session.user as any}>
      <div className="w-full max-w-2xl min-h-screen border-r border-white/10">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="hidden md:flex p-2 hover:bg-white/10 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-white">Notifications</h1>
          </div>
          {notifications.some((n: any) => !n.readAt) && <MarkAllAsReadButton />}
        </div>

        <NotificationsList initialData={notifications} />

      </div>
    </AppLayout>
  );
}
