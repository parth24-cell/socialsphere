"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { updateUserSettings } from "@/actions/settings";
import { toast } from "sonner";
import { Monitor, Moon, Sun } from "lucide-react";

export default function AppearanceForm({ initialTheme }: { initialTheme: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // If the database has a specific theme set, and it differs from local storage, 
    // we could sync it, but usually next-themes handles it well enough.
  }, []);

  if (!mounted) return null;

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    try {
      await updateUserSettings({ theme: newTheme.toUpperCase() });
      toast.success("Theme preference saved");
    } catch (e) {
      toast.error("Failed to save preference");
    }
  };

  const themes = [
    { id: "light", name: "Light", icon: Sun, desc: "Classic bright appearance" },
    { id: "dark", name: "Dark", icon: Moon, desc: "Easier on the eyes in low light" },
    { id: "system", name: "System", icon: Monitor, desc: "Follows your OS setting" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className={`flex flex-col items-center justify-center p-6 border rounded-xl transition ${
              theme === t.id 
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400" 
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300"
            }`}
          >
            <t.icon className="w-8 h-8 mb-3" />
            <span className="font-semibold">{t.name}</span>
            <span className="text-xs text-center mt-2 opacity-70">{t.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
