import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) redirect("/login");

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Account & Profile</h2>
      <SettingsForm profile={profile} />
    </div>
  );
}
