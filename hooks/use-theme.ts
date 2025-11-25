'use client';

import { useState, useEffect, useCallback } from 'react';
import { getThemePreference, setThemePreference } from '@/lib/storage';

type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = getThemePreference();
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (newTheme === 'dark' || (newTheme === 'system' && systemDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const changeTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    setThemePreference(newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
  }, [theme, changeTheme]);

  return {
    theme,
    setTheme: changeTheme,
    toggleTheme,
    isDark: theme === 'dark' || (theme === 'system' && (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)),
    mounted,
  };
}
