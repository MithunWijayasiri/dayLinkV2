'use client';

import { useAuth } from '@/hooks/use-auth';
import { getGreeting } from '@/lib/meeting-utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export function Greeting() {
  const { profile } = useAuth();
  const greeting = getGreeting();
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-foreground">
        {greeting}, {profile?.username || 'there'}!
      </h1>
      <p className="text-muted-foreground mt-1">{today}</p>
    </motion.div>
  );
}
