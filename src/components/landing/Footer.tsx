import Link from "next/link";
import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-zinc-400 py-16 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-white mb-4">
            <Globe className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">SocialSphere</span>
          </div>
          <p className="text-sm max-w-xs text-zinc-500">
            The next-generation social platform for meaningful conversations, creators, and communities.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Guidelines</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/10 text-sm flex flex-col md:flex-row items-center justify-between">
        <p>&copy; {new Date().getFullYear()} SocialSphere. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}
