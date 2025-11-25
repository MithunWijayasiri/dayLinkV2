'use client';

import { useState } from 'react';
import { Meeting } from '@/types';
import { getMeetingsForDate, formatMeetingTime } from '@/lib/meeting-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Plus, Video, Users, MonitorPlay, Link2, ExternalLink } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
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
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-50">Calendar</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={previousMonth}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-zinc-400" />
              </button>
              <h3 className="text-lg font-semibold text-zinc-50">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-zinc-500 py-2"
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
                        ? 'bg-zinc-50 text-zinc-900'
                        : dayIsToday
                        ? 'bg-zinc-800 text-zinc-50'
                        : 'hover:bg-zinc-800 text-zinc-300'
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
                                isSelected ? 'bg-zinc-900' : 'bg-blue-400'
                              }`}
                            />
                          ))
                        ) : (
                          <span className={`text-[10px] ${isSelected ? 'text-zinc-900' : 'text-blue-400'}`}>
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
          <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-6">
            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-zinc-50">
                      {format(selectedDate, 'MMM d, yyyy')}
                    </h4>
                    <Button
                      size="sm"
                      onClick={onAddMeeting}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {dayMeetings.length === 0 ? (
                    <p className="text-sm text-zinc-500">No meetings scheduled</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {dayMeetings.map((meeting) => {
                        const Icon = typeIcons[meeting.type];
                        return (
                          <div
                            key={meeting.id}
                            className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                          >
                            <div className="flex items-start gap-2">
                              <Icon className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-200 truncate">
                                  {meeting.title}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {formatMeetingTime(meeting.time)}
                                </p>
                              </div>
                              <button
                                onClick={() => window.open(meeting.link, '_blank')}
                                className="p-1 rounded hover:bg-zinc-700 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 text-zinc-500" />
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
                  <p className="text-sm text-zinc-500">
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
