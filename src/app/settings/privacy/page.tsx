import { getUserSettings } from "@/actions/settings";
import PrivacyForm from "./PrivacyForm";

export default async function PrivacyPage() {
  const settings = await getUserSettings();

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Privacy</h2>
      <p className="text-zinc-500 mb-6">Manage your visibility and data privacy.</p>
      
      <PrivacyForm initialSettings={settings} />
    </div>
  );
}
