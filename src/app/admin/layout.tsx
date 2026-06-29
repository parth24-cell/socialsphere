import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, Flag } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") redirect("/home");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-5xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900 flex">
        
        {/* Admin Sidebar */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0 p-4">
          <Link href="/home" className="text-xl font-bold text-indigo-600 flex items-center gap-2 mb-8">
            <ShieldCheck className="w-6 h-6" /> Admin Panel
          </Link>
          
          <nav className="flex-1 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium text-zinc-700 dark:text-zinc-300">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium text-zinc-700 dark:text-zinc-300">
              <Flag className="w-5 h-5" /> Reports & Moderation
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
