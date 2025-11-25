'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-muted animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className={`w-4 h-4 transition-colors ${isDark ? 'text-zinc-600' : 'text-amber-400'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-zinc-700"
      />
      <Moon className={`w-4 h-4 transition-colors ${isDark ? 'text-blue-400' : 'text-zinc-600'}`} />
    </div>
  );
}
