import { Meeting } from '@/types';
import { formatMeetingTime } from './meeting-utils';

export interface ScheduledNotification {
  meetingId: string;
  timeoutId: NodeJS.Timeout;
  type: '15min' | '5min' | 'now';
}

let scheduledNotifications: ScheduledNotification[] = [];

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Check if notifications are enabled
 */
export function areNotificationsEnabled(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Show a notification
 */
export function showNotification(title: string, options?: NotificationOptions): void {
  if (!areNotificationsEnabled()) return;
  
  const notification = new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options,
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

/**
 * Schedule notifications for a meeting
 */
export function scheduleMeetingNotifications(
  meeting: Meeting,
  preferences: { before15Min: boolean; before5Min: boolean; atTime: boolean }
): void {
  const now = new Date();
  const [hours, minutes] = meeting.time.split(':').map(Number);
  const meetingTime = new Date();
  meetingTime.setHours(hours, minutes, 0, 0);
  
  // If meeting time has passed, don't schedule
  if (meetingTime <= now) return;
  
  const timeUntilMeeting = meetingTime.getTime() - now.getTime();
  
  // Clear any existing notifications for this meeting
  clearMeetingNotifications(meeting.id);
  
  // Schedule 15 minutes before
  if (preferences.before15Min && timeUntilMeeting > 15 * 60 * 1000) {
    const timeoutId = setTimeout(() => {
      showNotification(`${meeting.title} in 15 minutes`, {
        body: `${meeting.type} at ${formatMeetingTime(meeting.time)}`,
        tag: `${meeting.id}-15min`,
      });
    }, timeUntilMeeting - 15 * 60 * 1000);
    
    scheduledNotifications.push({
      meetingId: meeting.id,
      timeoutId,
      type: '15min',
    });
  }
  
  // Schedule 5 minutes before
  if (preferences.before5Min && timeUntilMeeting > 5 * 60 * 1000) {
    const timeoutId = setTimeout(() => {
      showNotification(`${meeting.title} in 5 minutes`, {
        body: `${meeting.type} at ${formatMeetingTime(meeting.time)}`,
        tag: `${meeting.id}-5min`,
      });
    }, timeUntilMeeting - 5 * 60 * 1000);
    
    scheduledNotifications.push({
      meetingId: meeting.id,
      timeoutId,
      type: '5min',
    });
  }
  
  // Schedule at meeting time
  if (preferences.atTime) {
    const timeoutId = setTimeout(() => {
      showNotification(`${meeting.title} is starting now!`, {
        body: `Click to join ${meeting.type}`,
        tag: `${meeting.id}-now`,
        requireInteraction: true,
      });
    }, timeUntilMeeting);
    
    scheduledNotifications.push({
      meetingId: meeting.id,
      timeoutId,
      type: 'now',
    });
  }
}

/**
 * Clear notifications for a specific meeting
 */
export function clearMeetingNotifications(meetingId: string): void {
  scheduledNotifications
    .filter(n => n.meetingId === meetingId)
    .forEach(n => clearTimeout(n.timeoutId));
  
  scheduledNotifications = scheduledNotifications.filter(n => n.meetingId !== meetingId);
}

/**
 * Clear all scheduled notifications
 */
export function clearAllNotifications(): void {
  scheduledNotifications.forEach(n => clearTimeout(n.timeoutId));
  scheduledNotifications = [];
}

/**
 * Schedule notifications for all today's meetings
 */
export function scheduleAllNotifications(
  meetings: Meeting[],
  preferences: { before15Min: boolean; before5Min: boolean; atTime: boolean }
): void {
  clearAllNotifications();
  
  const now = new Date();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  
  meetings.forEach(meeting => {
    // Check if meeting occurs today
    let occursToday = false;
    
    switch (meeting.recurringType) {
      case 'everyday':
        occursToday = true;
        break;
      case 'weekdays':
        occursToday = now.getDay() >= 1 && now.getDay() <= 5;
        break;
      case 'weekends':
        occursToday = now.getDay() === 0 || now.getDay() === 6;
        break;
      case 'specificDays':
        occursToday = meeting.specificDays?.includes(dayName) || false;
        break;
      case 'specific':
        const todayStr = now.toISOString().split('T')[0];
        occursToday = meeting.specificDates?.includes(todayStr) || false;
        break;
    }
    
    if (occursToday) {
      scheduleMeetingNotifications(meeting, preferences);
    }
  });
}
