'use client';

import { useEffect, useCallback } from 'react';
import { Meeting } from '@/types';
import { useAuth } from './use-auth';
import {
  requestNotificationPermission,
  areNotificationsEnabled,
  scheduleAllNotifications,
  clearAllNotifications,
} from '@/lib/notifications';

export function useNotifications() {
  const { profile, updateProfile } = useAuth();

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    if (profile) {
      updateProfile({
        preferences: {
          ...profile.preferences,
          notifications: {
            ...profile.preferences.notifications,
            enabled: granted,
          },
        },
      });
    }
    return granted;
  }, [profile, updateProfile]);

  const scheduleNotifications = useCallback((meetings: Meeting[]) => {
    if (!profile?.preferences.notifications.enabled || !areNotificationsEnabled()) {
      return;
    }

    scheduleAllNotifications(meetings, {
      before15Min: profile.preferences.notifications.before15Min,
      before5Min: profile.preferences.notifications.before5Min,
      atTime: profile.preferences.notifications.atTime,
    });
  }, [profile]);

  const updateNotificationPreferences = useCallback((preferences: {
    enabled?: boolean;
    before15Min?: boolean;
    before5Min?: boolean;
    atTime?: boolean;
  }) => {
    if (!profile) return;

    updateProfile({
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
          ...preferences,
        },
      },
    });
  }, [profile, updateProfile]);

  // Clear notifications on unmount
  useEffect(() => {
    return () => {
      clearAllNotifications();
    };
  }, []);

  return {
    isEnabled: profile?.preferences.notifications.enabled ?? false,
    preferences: profile?.preferences.notifications,
    requestPermission,
    scheduleNotifications,
    updateNotificationPreferences,
    areNotificationsSupported: typeof window !== 'undefined' && 'Notification' in window,
  };
}
