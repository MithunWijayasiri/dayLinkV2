'use client';

import { Video, Users, MonitorPlay, Link2 } from 'lucide-react';

const platforms = [
  { name: 'Google Meet', icon: Video, color: 'text-green-400' },
  { name: 'Microsoft Teams', icon: Users, color: 'text-blue-400' },
  { name: 'Zoom', icon: MonitorPlay, color: 'text-sky-400' },
  { name: 'Custom Links', icon: Link2, color: 'text-zinc-400' },
];

export function Platforms() {
  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          Supports all major platforms
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <platform.icon className={`w-6 h-6 ${platform.color}`} />
              <span className="font-medium">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
