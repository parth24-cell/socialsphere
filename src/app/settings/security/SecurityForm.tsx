"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function SecurityForm() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    // Stub for updating email
    setTimeout(() => {
      setSavingEmail(false);
      toast.success("Verification email sent to new address");
      setEmail("");
    }, 1000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    // Stub for updating password
    setTimeout(() => {
      setSavingPassword(false);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      
      {/* Change Email */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-2">Change Email</h3>
        <p className="text-sm text-zinc-500 mb-4">Update the email address associated with your account.</p>
        <form onSubmit={handleUpdateEmail} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">New Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500"
              placeholder="new@example.com"
            />
          </div>
          <button 
            type="submit"
            disabled={savingEmail || !email}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {savingEmail ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-2">Change Password</h3>
        <p className="text-sm text-zinc-500 mb-4">Ensure your account is using a long, random password to stay secure.</p>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input 
              type="password" 
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <button 
            type="submit"
            disabled={savingPassword || !currentPassword || !newPassword}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

    </div>
  );
}
