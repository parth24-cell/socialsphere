import Link from "next/link";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight">SocialSphere</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-indigo-600 transition-colors">
            Log in
          </Link>
          <Link href="/register" className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="px-6 py-24 md:py-32 lg:px-12 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Connect. Share. Discover.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            The next generation enterprise social media platform built for speed, scale, and seamless community building.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow hover:bg-indigo-700 transition-all">
              Get Started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/explore" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-8 py-3.5 text-base font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
              Explore Feed
            </Link>
          </div>
        </section>

        <section className="px-6 py-20 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <div className="mx-auto md:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Built on Next.js and React Server Components for optimal performance and SEO.
              </p>
            </div>
            <div>
              <div className="mx-auto md:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Real-time Graph</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Instantly see updates from your network with a robust real-time feed architecture.
              </p>
            </div>
            <div>
              <div className="mx-auto md:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Enterprise Security</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Secure authentication, advanced moderation tools, and role-based access control.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} SocialSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}
