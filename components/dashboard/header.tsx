'use client';

import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut, Download, User, Settings, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function Header() {
  const { profile, logout, exportProfile } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = () => {
    const data = exportProfile();
    if (!data) {
      toast.error('Failed to export profile');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daylink-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup downloaded!');
    setShowMenu(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('See you next time!');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-zinc-50">dayLink</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Profile menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-300" />
                </div>
                <span className="text-sm text-zinc-300 hidden sm:block">
                  {profile?.username || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-zinc-800">
                      <p className="text-sm font-medium text-zinc-50">{profile?.username || 'User'}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-1">{profile?.uniquePhrase}</p>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={handleExport}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Export Backup
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
