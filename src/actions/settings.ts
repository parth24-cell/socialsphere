"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    return await prisma.userSettings.create({
      data: { userId: session.user.id }
    });
  }

  return settings;
}

export async function updateUserSettings(data: Partial<{
  theme: string;
  language: string;
  privacyLevel: string;
  notificationPrefs: string;
}>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const updated = await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...data,
    },
    update: data,
  });

  revalidatePath("/settings");
  return updated;
}
