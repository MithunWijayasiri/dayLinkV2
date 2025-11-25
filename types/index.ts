// Types and Interfaces for dayLink

export type MeetingType = 'Google Meet' | 'Microsoft Teams' | 'Zoom' | 'Other';

export type RecurringType = 'everyday' | 'weekdays' | 'weekends' | 'specific' | 'specificDays';

export interface Meeting {
  id: string;
  type: MeetingType;
  title: string;
  description?: string;
  link: string;
  time: string; // HH:MM (24-hour)
  recurringType: RecurringType;
  specificDates?: string[]; // YYYY-MM-DD
  specificDays?: string[]; // Monday, Tuesday, etc.
  isTemplate?: boolean;
  order?: number; // For drag and drop ordering
  createdAt: string;
  updatedAt: string;
}

export interface MeetingTemplate {
  id: string;
  type: MeetingType;
  title: string;
  description?: string;
  time: string;
  recurringType: RecurringType;
  specificDays?: string[];
}

export interface NotificationPreference {
  enabled: boolean;
  before15Min: boolean;
  before5Min: boolean;
  atTime: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  notifications: NotificationPreference;
}

export interface UserProfile {
  uniquePhrase: string;
  username?: string;
  meetings: Meeting[];
  templates: MeetingTemplate[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ExportedProfile {
  version: string;
  exportDate: string;
  username?: string;
  encryptedData: string;
}

// Auth context types
export interface AuthContextType {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  login: (phrase: string) => Promise<boolean>;
  logout: () => void;
  register: (phrase: string, username?: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  importProfile: (data: ExportedProfile, phrase: string) => Promise<boolean>;
  exportProfile: () => ExportedProfile | null;
}

// Meeting context types
export interface MeetingContextType {
  meetings: Meeting[];
  templates: MeetingTemplate[];
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  reorderMeetings: (meetings: Meeting[]) => void;
  addTemplate: (template: Omit<MeetingTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  getTodaysMeetings: () => Meeting[];
  getUpcomingMeeting: () => Meeting | null;
}

// Days of the week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

// Meeting type icons mapping
export const MEETING_TYPE_COLORS: Record<MeetingType, string> = {
  'Google Meet': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Microsoft Teams': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Zoom': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Other': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};
