'use client';

import { Button } from '@/components/ui/button';
import { Plus, Calendar, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionsProps {
  onAddMeeting: () => void;
  onViewCalendar: () => void;
  onViewTemplates: () => void;
}

export function QuickActions({ onAddMeeting, onViewCalendar, onViewTemplates }: QuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap gap-3"
    >
      <Button
        onClick={onAddMeeting}
        className="bg-foreground text-background hover:bg-foreground/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Meeting
      </Button>
      
      <Button
        onClick={onViewCalendar}
        variant="outline"
        className="bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Calendar
      </Button>
      
      <Button
        onClick={onViewTemplates}
        variant="outline"
        className="bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <LayoutTemplate className="w-4 h-4 mr-2" />
        Templates
      </Button>
    </motion.div>
  );
}
