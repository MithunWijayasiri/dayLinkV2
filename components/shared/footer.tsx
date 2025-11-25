'use client';

import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 border-t border-zinc-800/50 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-semibold text-zinc-50">dayLink</span>
            <span>•</span>
            <span className="text-sm">Privacy-first meeting scheduler</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-zinc-300 transition-colors"
            >
              <Github className="w-4 h-4" />
              Open Source
            </a>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400" /> for privacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
