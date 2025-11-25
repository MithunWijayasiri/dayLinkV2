'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMeetings } from '@/hooks/use-meetings';
import { useNotifications } from '@/hooks/use-notifications';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/dashboard/header';
import { Greeting } from '@/components/dashboard/greeting';
import { UpcomingCard } from '@/components/dashboard/upcoming-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { MeetingList } from '@/components/meetings/meeting-list';
import { MeetingForm } from '@/components/meetings/meeting-form';
import { MeetingTemplates } from '@/components/meetings/meeting-templates';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { Meeting } from '@/types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { isAuthenticated, profile } = useAuth();
  const {
    meetings,
    templates,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    reorderMeetings,
    addTemplate,
    deleteTemplate,
    getTodaysMeetings,
    getUpcomingMeeting,
  } = useMeetings();
  const { requestPermission, scheduleNotifications, isEnabled } = useNotifications();
  const router = useRouter();

  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, mounted, router]);

  // Request notification permission and schedule notifications
  useEffect(() => {
    if (isAuthenticated && meetings.length > 0) {
      if (!isEnabled) {
        requestPermission();
      }
      scheduleNotifications(meetings);
    }
  }, [isAuthenticated, meetings, isEnabled, requestPermission, scheduleNotifications]);

  const handleAddMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMeeting) {
      updateMeeting(editingMeeting.id, meeting);
    } else {
      addMeeting(meeting);
    }
    setEditingMeeting(null);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setShowMeetingForm(true);
  };

  const handleDeleteMeeting = (id: string) => {
    deleteMeeting(id);
    toast.success('Meeting deleted');
  };

  const handleCloseMeetingForm = () => {
    setShowMeetingForm(false);
    setEditingMeeting(null);
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  const todaysMeetings = getTodaysMeetings();
  const upcomingMeeting = getUpcomingMeeting();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Greeting />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Upcoming meeting card */}
          <UpcomingCard meeting={upcomingMeeting} />

          {/* Quick actions */}
          <QuickActions
            onAddMeeting={() => setShowMeetingForm(true)}
            onViewCalendar={() => setShowCalendar(true)}
            onViewTemplates={() => setShowTemplates(true)}
          />

          {/* Today's meetings section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Today&apos;s Meetings
                {todaysMeetings.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({todaysMeetings.length})
                  </span>
                )}
              </h2>
            </div>

            <MeetingList
              meetings={todaysMeetings}
              onAddMeeting={() => setShowMeetingForm(true)}
              onEditMeeting={handleEditMeeting}
              onDeleteMeeting={handleDeleteMeeting}
              onReorderMeetings={reorderMeetings}
            />
          </div>

          {/* All meetings section */}
          {meetings.length > todaysMeetings.length && (
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  All Meetings
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({meetings.length})
                  </span>
                </h2>
              </div>

              <MeetingList
                meetings={meetings}
                onAddMeeting={() => setShowMeetingForm(true)}
                onEditMeeting={handleEditMeeting}
                onDeleteMeeting={handleDeleteMeeting}
                onReorderMeetings={reorderMeetings}
              />
            </div>
          )}
        </motion.div>
      </main>

      {/* Modals */}
      <MeetingForm
        isOpen={showMeetingForm}
        onClose={handleCloseMeetingForm}
        onSave={handleAddMeeting}
        editMeeting={editingMeeting}
        templates={templates}
      />

      <CalendarView
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        meetings={meetings}
        onAddMeeting={() => {
          setShowCalendar(false);
          setShowMeetingForm(true);
        }}
      />

      <MeetingTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        templates={templates}
        onAddTemplate={addTemplate}
        onDeleteTemplate={deleteTemplate}
      />
    </div>
  );
}
