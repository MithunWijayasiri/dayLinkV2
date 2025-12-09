'use client';

import { useState } from 'react';
import { Meeting } from '@/types';
import { getMeetingsForDate, formatMeetingTime } from '@/lib/meeting-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Video, Users, MonitorPlay, Link2, ExternalLink } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarViewProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: Meeting[];
  onAddMeeting: () => void;
}

const typeIcons = {
  'Google Meet': Video,
  'Microsoft Teams': Users,
  'Zoom': MonitorPlay,
  'Other': Link2,
};

export function CalendarView({ isOpen, onClose, meetings, onAddMeeting }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getMeetingCount = (date: Date) => {
    return getMeetingsForDate(meetings, date).length;
  };

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const dayMeetings = selectedDate ? getMeetingsForDate(meetings, selectedDate) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">Calendar</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={previousMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h3 className="text-lg font-semibold text-foreground">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {days.map((day) => {
                const count = getMeetingCount(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayIsToday = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-lg p-1 transition-all relative ${
                      isSelected
                        ? 'bg-foreground text-background'
                        : dayIsToday
                        ? 'bg-muted text-foreground'
                        : 'hover:bg-muted text-foreground/80'
                    }`}
                  >
                    <span className="text-sm">{format(day, 'd')}</span>
                    {count > 0 && (
                      <div
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 ${
                          isSelected ? '' : ''
                        }`}
                      >
                        {count <= 3 ? (
                          Array.from({ length: count }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-background' : 'bg-blue-500 dark:bg-blue-400'
                              }`}
                            />
                          ))
                        ) : (
                          <span className={`text-[10px] ${isSelected ? 'text-background' : 'text-blue-500 dark:text-blue-400'}`}>
                            {count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day meetings */}
          <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">
                      {format(selectedDate, 'MMM d, yyyy')}
                    </h4>
                    <Button
                      size="sm"
                      onClick={onAddMeeting}
                      className="bg-muted hover:bg-muted/80 text-foreground"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {dayMeetings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No meetings scheduled</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {dayMeetings.map((meeting) => {
                        const Icon = typeIcons[meeting.type];
                        return (
                          <div
                            key={meeting.id}
                            className="p-3 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-start gap-2">
                              <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {meeting.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatMeetingTime(meeting.time)}
                                </p>
                              </div>
                              <button
                                onClick={() => window.open(meeting.link, '_blank')}
                                className="p-1 rounded hover:bg-muted transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="text-sm text-muted-foreground">
                    Select a date to view meetings
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
