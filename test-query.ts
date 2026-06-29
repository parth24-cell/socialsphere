import { prisma } from './src/lib/prisma';

async function main() {
  const currentUserId = '23f6ae89-cd0d-4562-ab3c-2ba6ef7c518f';
  const targetUserId = '520f6c87-9b2c-445e-8b97-24a354d94894';

  // 1. Check if the record exists directly
  const record = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId
      }
    }
  });
  console.log("Direct query record:", record);

  // 2. Query exactly like page.tsx
  const profileUser = await prisma.user.findFirst({
    where: { id: targetUserId },
    include: {
      followers: { where: { followerId: currentUserId } }
    }
  });
  console.log("Page query profileUser.followers:", profileUser?.followers);

  // 3. What if we use following instead?
  const profileUser2 = await prisma.user.findFirst({
    where: { id: targetUserId },
    include: {
      following: { where: { followerId: currentUserId } }
    }
  });
  console.log("Page query profileUser.following:", profileUser2?.following);
}

main().catch(console.error).finally(() => process.exit(0));
