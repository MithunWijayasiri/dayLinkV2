'use client';

import { Meeting, MEETING_TYPE_COLORS } from '@/types';
import { formatMeetingTime, getRecurringTypeText, isMeetingActive } from '@/lib/meeting-utils';
import { Button } from '@/components/ui/button';
import { ExternalLink, MoreVertical, Pencil, Trash2, GripVertical, Video, Users, MonitorPlay, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MeetingItemProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const typeIcons = {
  'Google Meet': Video,
  'Microsoft Teams': Users,
  'Zoom': MonitorPlay,
  'Other': Link2,
};

export function MeetingItem({ meeting, onEdit, onDelete, isDragging }: MeetingItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActive = isMeetingActive(meeting);
  const Icon = typeIcons[meeting.type];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: meeting.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      className={`group relative p-4 rounded-xl border transition-all ${
        isActive
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-card/60 border-border/50 hover:border-border'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Meeting type icon */}
        <div className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${MEETING_TYPE_COLORS[meeting.type]}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Meeting info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{meeting.title}</h4>
          <p className="text-sm text-muted-foreground">
            {formatMeetingTime(meeting.time)} • {getRecurringTypeText(meeting)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => window.open(meeting.link, '_blank')}
            size="sm"
            className={`shrink-0 ${
              isActive
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Join
          </Button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-1 w-36 rounded-lg bg-card border border-border shadow-xl overflow-hidden z-10"
              >
                <button
                  onClick={() => {
                    onEdit(meeting);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(meeting.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-muted transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {meeting.description && (
        <p className="text-sm text-muted-foreground mt-2 ml-14 truncate">{meeting.description}</p>
      )}
    </motion.div>
  );
}
