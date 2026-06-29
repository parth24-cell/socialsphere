"use client";

import { useState } from "react";
import { deleteAccount } from "@/actions/account";

export default function DeleteAccountForm() {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    await deleteAccount();
    // Action redirects
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">Delete Account</h3>
      <p className="text-sm text-red-700 dark:text-red-400 mb-6">
        Once you delete your account, there is no going back. Please be certain.
        This will permanently delete your profile, posts, comments, messages, and remove all your data from our servers.
      </p>

      <form onSubmit={handleDelete} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium mb-1 text-red-800 dark:text-red-300">
            Type <span className="font-bold">DELETE</span> to confirm
          </label>
          <input 
            type="text" 
            required
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-red-300 dark:border-red-700 rounded-lg p-2.5 text-sm outline-none focus:border-red-500 text-zinc-900 dark:text-zinc-50"
            placeholder="DELETE"
          />
        </div>
        <button 
          type="submit"
          disabled={deleting || confirmText !== "DELETE"}
          className="w-full bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition"
        >
          {deleting ? "Deleting Account..." : "Permanently Delete Account"}
        </button>
      </form>
    </div>
  );
}
