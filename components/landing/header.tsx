'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export function Header({ onLogin, onGetStarted }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-md border-b border-border/40"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight">dayLink</span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" onClick={onLogin}>
            Login
          </Button>
          <Button onClick={onGetStarted}>Get Started</Button>
        </div>
        
        {/* Mobile menu placeholder if needed, for now keeping it simple */}
        <div className="sm:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onLogin}>
                Login
            </Button>
        </div>
      </div>
    </motion.header>
  );
}
