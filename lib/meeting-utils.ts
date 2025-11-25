import { Meeting, DAYS_OF_WEEK } from '@/types';
import { format, isToday, parse, isBefore, isAfter, addMinutes } from 'date-fns';

/**
 * Check if a meeting occurs on a given date
 */
export function meetingOccursOnDate(meeting: Meeting, date: Date): boolean {
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const dateStr = format(date, 'yyyy-MM-dd');
  
  switch (meeting.recurringType) {
    case 'everyday':
      return true;
      
    case 'weekdays':
      return date.getDay() >= 1 && date.getDay() <= 5;
      
    case 'weekends':
      return date.getDay() === 0 || date.getDay() === 6;
      
    case 'specificDays':
      return meeting.specificDays?.includes(dayName) || false;
      
    case 'specific':
      return meeting.specificDates?.includes(dateStr) || false;
      
    default:
      return false;
  }
}

/**
 * Get meetings for today
 */
export function getTodaysMeetings(meetings: Meeting[]): Meeting[] {
  const today = new Date();
  return meetings
    .filter(meeting => meetingOccursOnDate(meeting, today))
    .sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Get meetings for a specific date
 */
export function getMeetingsForDate(meetings: Meeting[], date: Date): Meeting[] {
  return meetings
    .filter(meeting => meetingOccursOnDate(meeting, date))
    .sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Get the next upcoming meeting
 */
export function getUpcomingMeeting(meetings: Meeting[]): Meeting | null {
  const now = new Date();
  const todaysMeetings = getTodaysMeetings(meetings);
  
  const currentTimeStr = format(now, 'HH:mm');
  
  // Find the first meeting that hasn't started yet
  const upcoming = todaysMeetings.find(meeting => meeting.time > currentTimeStr);
  
  return upcoming || null;
}

/**
 * Get time until a meeting starts
 */
export function getTimeUntilMeeting(meeting: Meeting): { hours: number; minutes: number } | null {
  const now = new Date();
  const [hours, minutes] = meeting.time.split(':').map(Number);
  const meetingTime = new Date();
  meetingTime.setHours(hours, minutes, 0, 0);
  
  if (isBefore(meetingTime, now)) {
    return null;
  }
  
  const diffMs = meetingTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  return {
    hours: Math.floor(diffMinutes / 60),
    minutes: diffMinutes % 60,
  };
}

/**
 * Check if a meeting is currently active (within 5 minutes of start time)
 */
export function isMeetingActive(meeting: Meeting): boolean {
  const now = new Date();
  const [hours, minutes] = meeting.time.split(':').map(Number);
  const meetingTime = new Date();
  meetingTime.setHours(hours, minutes, 0, 0);
  
  const startWindow = addMinutes(meetingTime, -5);
  const endWindow = addMinutes(meetingTime, 30); // Assume 30 min meeting
  
  return isAfter(now, startWindow) && isBefore(now, endWindow);
}

/**
 * Format time for display
 */
export function formatMeetingTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'h:mm a');
}

/**
 * Get recurring type display text
 */
export function getRecurringTypeText(meeting: Meeting): string {
  switch (meeting.recurringType) {
    case 'everyday':
      return 'Every day';
    case 'weekdays':
      return 'Weekdays';
    case 'weekends':
      return 'Weekends';
    case 'specificDays':
      return meeting.specificDays?.join(', ') || 'Specific days';
    case 'specific':
      return 'Specific dates';
    default:
      return '';
  }
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Get meeting platform icon name
 */
export function getMeetingIcon(type: Meeting['type']): string {
  switch (type) {
    case 'Google Meet':
      return 'video';
    case 'Microsoft Teams':
      return 'users';
    case 'Zoom':
      return 'video';
    case 'Other':
      return 'link';
    default:
      return 'calendar';
  }
}
