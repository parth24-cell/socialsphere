"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

export async function uploadMedia(formData: FormData): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const files = formData.getAll("files") as File[];
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "socialsphere", resource_type: "auto", timeout: 60000 }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    uploadedUrls.push(result.secure_url);
  }

  return uploadedUrls;
}

export async function createPost(content: string, mediaUrls: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      content,
      images: {
        create: mediaUrls.map((url) => ({ url })),
      },
    },
  });

  revalidatePath("/home");
  return post;
}

export async function toggleLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const userId = session.user.id;

  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    // Notify post author
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (post && post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: userId,
          type: "LIKE",
          entityId: postId,
        },
      });
    }
  }

  revalidatePath("/home");
}

export async function addComment(postId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: session.user.id,
      content,
    },
  });

  // Notify post author
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (post && post.authorId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        actorId: session.user.id,
        type: "COMMENT",
        entityId: comment.id,
      },
    });
  }

  revalidatePath("/home");
}

export async function toggleBookmark(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      userId: session.user.id,
      postId,
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
  }

  revalidatePath("/home");
  revalidatePath("/bookmarks");
  revalidatePath(`/post/${postId}`);
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id: postId }
  });

  revalidatePath("/home");
}

export async function editPost(postId: string, content: string, newMediaUrls?: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updateData: any = { content };

  if (newMediaUrls && newMediaUrls.length > 0) {
    // We could delete old images and add new ones if we want to support full replacement
    await prisma.postImage.deleteMany({ where: { postId } });
    updateData.images = {
      create: newMediaUrls.map((url) => ({ url })),
    };
  } else if (newMediaUrls && newMediaUrls.length === 0) {
    // If empty array passed explicitly, remove images
    await prisma.postImage.deleteMany({ where: { postId } });
  }

  await prisma.post.update({
    where: { id: postId },
    data: updateData,
  });

  revalidatePath("/home");
  revalidatePath(`/post/${postId}`);
}
