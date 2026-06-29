"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Anonymizing data or deleting data depending on policy.
  // Prisma's Cascade delete will handle related models like posts, comments, likes.
  // In a real app we might soft delete or anonymize.
  // Here we hard delete.
  
  await prisma.user.delete({
    where: { id: session.user.id }
  });

  // Redirect to sign in after deletion. Note: session will become invalid.
  redirect("/login");
}
