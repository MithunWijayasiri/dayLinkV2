'use client';

import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 border-t border-border/50 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-foreground">dayLink</span>
            <span>•</span>
            <span className="text-sm">Meeting scheduler</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/MithunWijayasiri/dayLinkV2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              Open Source
            </a>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500" /> by Mithun Wijayasiri
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
