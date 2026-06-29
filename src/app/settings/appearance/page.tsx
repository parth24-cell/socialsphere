import { getUserSettings } from "@/actions/settings";
import AppearanceForm from "./AppearanceForm";

export default async function AppearancePage() {
  const settings = await getUserSettings();

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Appearance</h2>
      <p className="text-zinc-500 mb-6">Customize how SocialSphere looks on your device.</p>
      
      <AppearanceForm initialTheme={settings.theme} />
    </div>
  );
}
