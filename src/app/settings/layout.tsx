import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Shield, Lock, Bell, Palette, Globe, Accessibility, Smartphone, Ban, Trash2 } from "lucide-react";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const navItems = [
    { name: "Account & Profile", href: "/settings/account", icon: User },
    { name: "Security", href: "/settings/security", icon: Lock },
    { name: "Privacy", href: "/settings/privacy", icon: Shield },
    { name: "Notifications", href: "/settings/notifications", icon: Bell },
    { name: "Appearance", href: "/settings/appearance", icon: Palette },
    { name: "Language", href: "/settings/language", icon: Globe },
    { name: "Accessibility", href: "/settings/accessibility", icon: Accessibility },
    { name: "Connected Devices", href: "/settings/devices", icon: Smartphone },
    { name: "Blocked Users", href: "/settings/blocked", icon: Ban },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row min-h-screen">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 hidden md:block">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <Link href="/home" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition -ml-2">
              <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
            </Link>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>
          </div>
          
          <nav className="p-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}

            <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
            
            <Link 
              href="/settings/delete-account"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 transition"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Delete Account</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-zinc-900">
          <div className="md:hidden sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-4">
            <Link href="/home" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition -ml-2">
              <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
            </Link>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
