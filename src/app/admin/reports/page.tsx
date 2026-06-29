import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReportActions from "./ReportActions";

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, profile: true } }
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Moderation Queue</h1>
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <th className="px-6 py-4">Reported ID</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No pending reports. All clear!
                </td>
              </tr>
            )}
            {reports.map((report: any) => (
              <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition">
                <td className="px-6 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-400 max-w-[120px] truncate">
                  {report.entityId}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    report.entityType === 'USER' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {report.entityType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  {report.reason}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  @{report.reporter.username}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  {new Date(report.createdAt).toLocaleDateString("en-US")}
                </td>
                <td className="px-6 py-4 text-right">
                  <ReportActions reportId={report.id} entityId={report.entityId} entityType={report.entityType} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
