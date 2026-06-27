import { notFound } from "next/navigation";

export default function ProfilePage({ params }: { params: { username: string } }) {
  // Mock data for basic view
  const user = {
    username: params.username,
    displayName: "Mock User",
    bio: "This is a placeholder bio for the MVP profile page.",
    followers: 120,
    following: 45,
  };

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow border border-zinc-200 dark:border-zinc-800">
        {/* Cover Photo */}
        <div className="h-32 w-full bg-indigo-200 dark:bg-indigo-900 md:h-48"></div>

        <div className="px-4 py-4 md:px-8">
          {/* Avatar & Action Button */}
          <div className="relative flex justify-between">
            <div className="-mt-12 md:-mt-16 h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-300 dark:bg-zinc-700">
              {/* Avatar placeholder */}
            </div>
            <button className="mt-2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-4 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Profile Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{user.displayName}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
          </div>

          <div className="mt-4">
            <p className="text-zinc-700 dark:text-zinc-300">{user.bio}</p>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{user.following}</span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400">Following</span>
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{user.followers}</span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400">Followers</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex border-t border-zinc-200 dark:border-zinc-800">
          <button className="flex-1 py-4 text-center text-sm font-medium border-b-2 border-indigo-500 text-zinc-900 dark:text-zinc-50">
            Posts
          </button>
          <button className="flex-1 py-4 text-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            Replies
          </button>
          <button className="flex-1 py-4 text-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            Media
          </button>
        </div>
      </div>
      
      {/* Feed Placeholder */}
      <div className="mt-4 space-y-4">
        <div className="h-32 rounded-xl bg-white dark:bg-zinc-900 shadow border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">No posts yet.</p>
        </div>
      </div>
    </div>
  );
}
