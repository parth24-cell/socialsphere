import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Shield, Lock, Bell, Palette, Globe, Accessibility, Smartphone, Ban, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/navigation/AppLayout";

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
    <AppLayout user={session.user as any}>
      <div className="w-full flex flex-col md:flex-row h-full min-h-screen">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-white/10 shrink-0 hidden md:block">
          <div className="p-4 border-b border-white/10 flex items-center gap-2">
            <Link href="/home" className="p-2 hover:bg-white/10 rounded-full transition -ml-2">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-white">Settings</h1>
          </div>
          
          <nav className="p-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}

            <div className="my-2 border-t border-white/10" />
            
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
        <main className="flex-1 bg-background">
          <div className="md:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-4">
            <Link href="/home" className="p-2 hover:bg-white/10 rounded-full transition -ml-2">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-lg font-bold font-heading text-white">Settings</h1>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>

      </div>
    </AppLayout>
  );
}
