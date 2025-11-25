'use client';

import { useState, useEffect, useCallback } from 'react';
import { Meeting, MeetingTemplate } from '@/types';
import { useAuth } from './use-auth';
import { generateId } from '@/lib/encryption';
import { getTodaysMeetings, getUpcomingMeeting as getUpcoming } from '@/lib/meeting-utils';

export function useMeetings() {
  const { profile, updateProfile } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [templates, setTemplates] = useState<MeetingTemplate[]>([]);

  useEffect(() => {
    if (profile) {
      setMeetings(profile.meetings || []);
      setTemplates(profile.templates || []);
    }
  }, [profile]);

  const addMeeting = useCallback((meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMeeting: Meeting = {
      ...meeting,
      id: generateId(),
      order: meetings.length,
      createdAt: now,
      updatedAt: now,
    };

    const updatedMeetings = [...meetings, newMeeting];
    setMeetings(updatedMeetings);
    updateProfile({ meetings: updatedMeetings });
  }, [meetings, updateProfile]);

  const updateMeeting = useCallback((id: string, updates: Partial<Meeting>) => {
    const updatedMeetings = meetings.map(meeting =>
      meeting.id === id
        ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
        : meeting
    );
    setMeetings(updatedMeetings);
    updateProfile({ meetings: updatedMeetings });
  }, [meetings, updateProfile]);

  const deleteMeeting = useCallback((id: string) => {
    const updatedMeetings = meetings.filter(meeting => meeting.id !== id);
    setMeetings(updatedMeetings);
    updateProfile({ meetings: updatedMeetings });
  }, [meetings, updateProfile]);

  const reorderMeetings = useCallback((reorderedMeetings: Meeting[]) => {
    const withOrder = reorderedMeetings.map((meeting, index) => ({
      ...meeting,
      order: index,
    }));
    setMeetings(withOrder);
    updateProfile({ meetings: withOrder });
  }, [updateProfile]);

  const addTemplate = useCallback((template: Omit<MeetingTemplate, 'id'>) => {
    const newTemplate: MeetingTemplate = {
      ...template,
      id: generateId(),
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    updateProfile({ templates: updatedTemplates });
  }, [templates, updateProfile]);

  const deleteTemplate = useCallback((id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    updateProfile({ templates: updatedTemplates });
  }, [templates, updateProfile]);

  const getTodaysMeetingsList = useCallback(() => {
    return getTodaysMeetings(meetings);
  }, [meetings]);

  const getUpcomingMeeting = useCallback(() => {
    return getUpcoming(meetings);
  }, [meetings]);

  return {
    meetings,
    templates,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    reorderMeetings,
    addTemplate,
    deleteTemplate,
    getTodaysMeetings: getTodaysMeetingsList,
    getUpcomingMeeting,
  };
}
