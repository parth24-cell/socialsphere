"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Monitor, Smartphone, Globe, ShieldAlert } from "lucide-react";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthInput } from "@/components/auth/AuthInput";

export default function SecurityForm() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    setTimeout(() => {
      setSavingEmail(false);
      toast.success("Verification email sent to new address");
      setEmail("");
    }, 1000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    }, 1000);
  };

  const handleRevokeSessions = async () => {
    setRevoking(true);
    setTimeout(() => {
      setRevoking(false);
      setShowRevokeModal(false);
      toast.success("All other sessions have been revoked");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Change Email */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-2 text-white">Change Email</h3>
        <p className="text-sm text-white/60 mb-6 max-w-md">Update the email address associated with your account. A verification link will be sent to the new address.</p>
        <form onSubmit={handleUpdateEmail} className="space-y-5 max-w-md">
          <AuthInput 
            label="New Email Address"
            type="email" 
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="new@example.com"
          />
          <button 
            type="submit"
            disabled={savingEmail || !email}
            className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {savingEmail ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {savingEmail ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-2 text-white">Change Password</h3>
        <p className="text-sm text-white/60 mb-6 max-w-md">Ensure your account is using a long, random password to stay secure.</p>
        <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-md">
          <PasswordInput 
            label="Current Password"
            name="currentPassword"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <PasswordInput 
            label="New Password"
            name="newPassword"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            showStrength
          />
          <button 
            type="submit"
            disabled={savingPassword || !currentPassword || !newPassword}
            className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">Active Sessions</h3>
            <p className="text-sm text-white/60">Manage the devices that are logged into your account.</p>
          </div>
          <button 
            onClick={() => setShowRevokeModal(true)}
            className="shrink-0 flex items-center bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
          >
            Revoke all other sessions
          </button>
        </div>

        <div className="space-y-3">
          {/* Current Session */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white truncate">Mac OS • Chrome</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                  Current
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> San Francisco, US</span>
                <span>•</span>
                <span>Active now</span>
              </div>
            </div>
          </div>

          {/* Other Session */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-white/10 rounded-lg text-white/60">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate mb-1">iOS • Safari</div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> New York, US</span>
                <span>•</span>
                <span>Last active 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Revoke all other sessions?</h2>
            <p className="text-white/60 text-sm mb-6">
              You will be signed out of all other devices except this one. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRevokeModal(false)}
                disabled={revoking}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeSessions}
                disabled={revoking}
                className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                {revoking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Revoke Sessions"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
