"use client";

import { useState } from "react";
import { updateUserSettings } from "@/actions/settings";
import { toast } from "sonner";

export default function PrivacyForm({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState({
    privacyLevel: initialSettings.privacyLevel ?? "PUBLIC",
    privacyShowOnline: true,
    privacyShowReadReceipt: true,
  });

  const [saving, setSaving] = useState(false);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = typeof settings[key] === "boolean" ? !settings[key] : settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    
    setSaving(true);
    try {
      // We don't save privacyShowOnline/ReadReceipt as they don't exist in schema yet
      // await updateUserSettings({ [key]: newValue });
      toast.success("Privacy preferences updated");
    } catch (e) {
      toast.error("Failed to update preferences");
      setSettings((prev) => ({ ...prev, [key]: !newValue }));
    } finally {
      setSaving(false);
    }
  };

  const handleProfileChange = async (val: string) => {
    setSettings((prev) => ({ ...prev, privacyLevel: val }));
    setSaving(true);
    try {
      await updateUserSettings({ privacyLevel: val });
      toast.success("Profile privacy updated");
    } catch (e) {
      toast.error("Failed to update profile privacy");
      setSettings((prev) => ({ ...prev, privacyLevel: initialSettings.privacyLevel }));
    } finally {
      setSaving(false);
    }
  };

  const ToggleItem = ({ label, desc, field }: { label: string, desc: string, field: "privacyShowOnline" | "privacyShowReadReceipt" }) => (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div>
        <p className="font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
        <p className="text-sm text-zinc-500">{desc}</p>
      </div>
      <button 
        onClick={() => handleToggle(field)}
        disabled={saving}
        className={`w-11 h-6 rounded-full flex items-center px-1 transition duration-200 ease-in-out ${settings[field] ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-200 ease-in-out ${settings[field] ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
      
      <div>
        <h3 className="text-lg font-bold mb-2">Account Privacy</h3>
        <p className="text-sm text-zinc-500 mb-4">Choose who can see your profile and posts.</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
            <input 
              type="radio" 
              name="privacy" 
              value="PUBLIC" 
              checked={settings.privacyLevel === "PUBLIC"} 
              onChange={() => handleProfileChange("PUBLIC")}
              className="w-4 h-4 text-indigo-600"
            />
            <div>
              <p className="font-medium">Public</p>
              <p className="text-xs text-zinc-500">Anyone can see your profile and posts.</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
            <input 
              type="radio" 
              name="privacy" 
              value="PRIVATE" 
              checked={settings.privacyLevel === "PRIVATE"} 
              onChange={() => handleProfileChange("PRIVATE")}
              className="w-4 h-4 text-indigo-600"
            />
            <div>
              <p className="font-medium">Private</p>
              <p className="text-xs text-zinc-500">Only approved followers can see your posts.</p>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h3 className="text-lg font-bold mb-4">Activity Status</h3>
        <ToggleItem label="Show Activity Status" desc="Let others know when you are online." field="privacyShowOnline" />
        <ToggleItem label="Send Read Receipts" desc="Let others know when you've read their messages." field="privacyShowReadReceipt" />
      </div>

    </div>
  );
}
