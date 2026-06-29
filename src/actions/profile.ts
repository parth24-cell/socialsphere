"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  username?: string;
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatarUrl?: string;
  coverUrl?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentProfile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!currentProfile) throw new Error("Profile not found");

  const updateData: any = { ...data };
  if (updateData.username) {
    updateData.username = updateData.username.trim();
  }

  // Handle username change with rate limiting
  if (updateData.username && updateData.username !== currentProfile.username) {
    // Check rate limit (30 days)
    if (currentProfile.usernameUpdatedAt) {
      const daysSinceUpdate = (Date.now() - currentProfile.usernameUpdatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 30) {
        throw new Error(`You can only change your username once every 30 days. Please wait ${Math.ceil(30 - daysSinceUpdate)} more days.`);
      }
    }
    
    // Check uniqueness
    const existing = await prisma.profile.findUnique({ where: { username: updateData.username } });
    if (existing) {
      throw new Error("Username is already taken");
    }

    updateData.usernameUpdatedAt = new Date();
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId: session.user.id },
    data: updateData,
  });

  revalidatePath(`/${currentProfile.username}`); // Revalidate old profile url
  revalidatePath(`/${updatedProfile.username}`); // Revalidate new profile url
  revalidatePath("/settings");
  revalidatePath("/home");

  return updatedProfile;
}
