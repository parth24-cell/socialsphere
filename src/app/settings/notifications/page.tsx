import { getUserSettings } from "@/actions/settings";
import NotificationsForm from "./NotificationsForm";

export default async function NotificationsPage() {
  const settings = await getUserSettings();

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Notifications</h2>
      <p className="text-zinc-500 mb-6">Manage how and when you receive alerts.</p>
      
      <NotificationsForm initialSettings={settings} />
    </div>
  );
}
