"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  
  return user;
}

export async function getAdminMetrics() {
  await requireAdmin();
  
  const [totalUsers, totalPosts, totalReports, recentSignups] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })
  ]);

  return { totalUsers, totalPosts, totalReports, recentSignups };
}

export async function banUser(userId: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { status: "BANNED" }
  });
  revalidatePath("/admin/reports");
}

export async function deletePostByAdmin(postId: string) {
  await requireAdmin();
  await prisma.post.delete({
    where: { id: postId }
  });
  revalidatePath("/admin/reports");
}

export async function resolveReport(reportId: string, action: "RESOLVED" | "DISMISSED") {
  const admin = await requireAdmin();
  
  await prisma.report.update({
    where: { id: reportId },
    data: { 
      status: action,
      resolvedBy: admin.id
    }
  });
  
  revalidatePath("/admin/reports");
}
