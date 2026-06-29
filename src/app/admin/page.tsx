import { getAdminMetrics } from "@/actions/admin";
import { Users, FileText, AlertTriangle, UserPlus } from "lucide-react";

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics();

  const cards = [
    { title: "Total Users", value: metrics.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Total Posts", value: metrics.totalPosts, icon: FileText, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { title: "Pending Reports", value: metrics.totalReports, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
    { title: "New Signups (7d)", value: metrics.recentSignups, icon: UserPlus, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.title}</p>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
