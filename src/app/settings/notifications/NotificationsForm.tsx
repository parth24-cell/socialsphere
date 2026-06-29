"use client";

import { useState } from "react";
import { updateUserSettings } from "@/actions/settings";
import { toast } from "sonner";

export default function NotificationsForm({ initialSettings }: { initialSettings: any }) {
  const prefs = initialSettings.notificationPrefs 
    ? JSON.parse(initialSettings.notificationPrefs) 
    : {};

  const [settings, setSettings] = useState({
    notifyEmail: prefs.notifyEmail ?? true,
    notifyPush: prefs.notifyPush ?? true,
    notifyLikes: prefs.notifyLikes ?? true,
    notifyComments: prefs.notifyComments ?? true,
    notifyFollows: prefs.notifyFollows ?? true,
    notifyMessages: prefs.notifyMessages ?? true,
  });

  const [saving, setSaving] = useState(false);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);
    
    setSaving(true);
    try {
      await updateUserSettings({ notificationPrefs: JSON.stringify(newSettings) });
      toast.success("Preferences updated");
    } catch (e) {
      console.error("Error saving notification prefs:", e);
      toast.error("Failed to update preferences");
      // Revert on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const ToggleItem = ({ label, desc, field }: { label: string, desc: string, field: keyof typeof settings }) => (
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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Notification Channels</h3>
      <ToggleItem label="Email Notifications" desc="Receive daily summaries and important alerts via email." field="notifyEmail" />
      <ToggleItem label="Push Notifications" desc="Receive real-time alerts on this device." field="notifyPush" />
      
      <h3 className="text-lg font-bold mt-8 mb-4">Activity Alerts</h3>
      <ToggleItem label="Likes" desc="Notify when someone likes your post." field="notifyLikes" />
      <ToggleItem label="Comments" desc="Notify when someone comments on your post." field="notifyComments" />
      <ToggleItem label="New Followers" desc="Notify when someone starts following you." field="notifyFollows" />
      <ToggleItem label="Direct Messages" desc="Notify when you receive a new message." field="notifyMessages" />
    </div>
  );
}
