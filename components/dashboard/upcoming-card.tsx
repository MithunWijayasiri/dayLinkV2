'use client';

import { Meeting } from '@/types';
import { getTimeUntilMeeting, formatMeetingTime, isMeetingActive } from '@/lib/meeting-utils';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface UpcomingCardProps {
  meeting: Meeting | null;
}

export function UpcomingCard({ meeting }: UpcomingCardProps) {
  const [timeUntil, setTimeUntil] = useState<{ hours: number; minutes: number } | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!meeting) return;

    const updateTime = () => {
      setTimeUntil(getTimeUntilMeeting(meeting));
      setIsActive(isMeetingActive(meeting));
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [meeting]);

  if (!meeting) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/50 border border-border/50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Next Up</span>
        </div>
        <p className="text-muted-foreground">No more meetings today. Enjoy your free time!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${
        isActive
          ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30'
          : 'bg-zinc-900/60 border-zinc-800/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Clock className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-zinc-500'}`} />
            <span className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-zinc-400'}`}>
              {isActive ? 'Starting now!' : 'Next Up'}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-zinc-50 mb-1">{meeting.title}</h3>
          <p className="text-zinc-400 text-sm mb-4">
            {formatMeetingTime(meeting.time)} • {meeting.type}
          </p>

          {timeUntil && !isActive && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-zinc-50">{timeUntil.hours}</span>
                <span className="text-xs text-zinc-500 block">hours</span>
              </div>
              <span className="text-zinc-600">:</span>
              <div className="text-center">
                <span className="text-2xl font-bold text-zinc-50">{timeUntil.minutes}</span>
                <span className="text-xs text-zinc-500 block">mins</span>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() => window.open(meeting.link, '_blank')}
          className={`shrink-0 ${
            isActive
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
          }`}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Join
        </Button>
      </div>
    </motion.div>
  );
}
