'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, X, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { navItems } from '@/config/navigation';

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-tooltip bg-brand-dark/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-modal h-screen w-64 border-r border-slate-800 bg-brand-dark flex flex-col transition-transform duration-300 ease-spring ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-brand-dark">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-float shadow-indigo-500/20">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">UniversalPOS</span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Platform Admin</p>
          
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && 
                             (item.href !== '/dashboard' || pathname === '/dashboard');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-spring relative group overflow-hidden',
                  isActive 
                    ? 'text-white bg-slate-800/50 shadow-inset-white-soft' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                )}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-indigo-500 rounded-r-full" />}
                <item.icon className={cn("h-5 w-5 transition-transform duration-300 ease-spring group-hover:scale-110", isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300')} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-brand-dark space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 ease-spring group"
          >
            <Settings className="h-5 w-5 text-slate-500 group-hover:text-slate-300 transition-transform duration-300 ease-spring group-hover:rotate-90" />
            Settings
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('admin_auth');
              router.replace('/login');
            }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 ease-spring group"
          >
            <LogOut className="h-5 w-5 text-red-400/60 group-hover:text-red-400 transition-transform duration-300 ease-spring group-hover:-translate-x-1" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
