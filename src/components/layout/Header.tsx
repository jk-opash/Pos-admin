'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  
  // Simple breadcrumb logic based on pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1) 
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/60 bg-white/70 px-4 md:px-8 backdrop-blur-xl shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight truncate">{currentPage}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden lg:block group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search across platform..."
            className="w-64 rounded-full bg-slate-50/80 border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all duration-300 ease-spring shadow-inset-subtle focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:w-80"
          />
        </div>

        {/* Mobile Search Icon */}
        <button className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors">
          <Search className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 md:gap-4 border-l border-slate-200 pl-4 md:pl-6">
          <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-[9px] font-bold text-white shadow-sm shadow-red-500/30 border-2 border-white">
              3
            </span>
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Admin User</span>
              <Badge variant="purple" className="text-[9px] py-0 border-indigo-100">Superadmin</Badge>
            </div>
            <Avatar name="Admin User" size="sm" className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
}
