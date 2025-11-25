'use client';

import { motion } from 'framer-motion';
import { Calendar, Coffee, Inbox } from 'lucide-react';

interface EmptyStateProps {
  type: 'meetings' | 'calendar' | 'templates';
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  meetings: Inbox,
  calendar: Calendar,
  templates: Coffee,
};

const defaults = {
  meetings: {
    title: 'No meetings today',
    description: 'Add your first meeting to get started',
  },
  calendar: {
    title: 'No meetings on this day',
    description: 'Click to add a meeting for this date',
  },
  templates: {
    title: 'No templates yet',
    description: 'Create a template for recurring meetings',
  },
};

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const Icon = icons[type];
  const defaultContent = defaults[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-medium text-foreground mb-1">
        {title || defaultContent.title}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-xs mb-4">
        {description || defaultContent.description}
      </p>
      
      {action}
    </motion.div>
  );
}
