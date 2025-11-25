'use client';

import { Meeting } from '@/types';
import { MeetingItem } from './meeting-item';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface MeetingListProps {
  meetings: Meeting[];
  onAddMeeting: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (id: string) => void;
  onReorderMeetings: (meetings: Meeting[]) => void;
}

export function MeetingList({
  meetings,
  onAddMeeting,
  onEditMeeting,
  onDeleteMeeting,
  onReorderMeetings,
}: MeetingListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = meetings.findIndex((m) => m.id === active.id);
      const newIndex = meetings.findIndex((m) => m.id === over.id);
      const reordered = arrayMove(meetings, oldIndex, newIndex);
      onReorderMeetings(reordered);
    }
  };

  if (meetings.length === 0) {
    return (
      <EmptyState
        type="meetings"
        action={
          <Button
            onClick={onAddMeeting}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Meeting
          </Button>
        }
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={meetings.map(m => m.id)} strategy={verticalListSortingStrategy}>
          {meetings.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              meeting={meeting}
              onEdit={onEditMeeting}
              onDelete={onDeleteMeeting}
            />
          ))}
        </SortableContext>
      </DndContext>
    </motion.div>
  );
}
