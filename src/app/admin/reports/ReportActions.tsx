"use client";

import { useState } from "react";
import { resolveReport, banUser, deletePostByAdmin } from "@/actions/admin";
import { ShieldAlert, Trash, Check, Loader2 } from "lucide-react";

type Props = {
  reportId: string;
  entityId: string;
  entityType: string;
};

export default function ReportActions({ reportId, entityId, entityType }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionType: "DISMISS" | "BAN" | "DELETE") => {
    setLoading(true);
    try {
      if (actionType === "DISMISS") {
        await resolveReport(reportId, "DISMISSED");
      } else if (actionType === "BAN") {
        await banUser(entityId);
        await resolveReport(reportId, "RESOLVED");
      } else if (actionType === "DELETE") {
        await deletePostByAdmin(entityId);
        await resolveReport(reportId, "RESOLVED");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-zinc-500 ml-auto" />;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => handleAction("DISMISS")}
        className="p-2 text-zinc-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition"
        title="Dismiss Report"
      >
        <Check className="w-4 h-4" />
      </button>

      {entityType === "USER" && (
        <button
          onClick={() => handleAction("BAN")}
          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
          title="Ban User"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      )}

      {entityType === "POST" && (
        <button
          onClick={() => handleAction("DELETE")}
          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
          title="Delete Post"
        >
          <Trash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
