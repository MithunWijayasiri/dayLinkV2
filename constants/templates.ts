import { MeetingTemplate } from '@/types';

export const DEFAULT_TEMPLATES: MeetingTemplate[] = [
  {
    id: 'template-1',
    type: 'Google Meet',
    title: 'Daily Standup',
    description: 'Daily team sync-up meeting',
    time: '09:00',
    recurringType: 'weekdays',
  },
  {
    id: 'template-2',
    type: 'Microsoft Teams',
    title: 'Weekly Team Meeting',
    description: 'Weekly team discussion and updates',
    time: '10:00',
    recurringType: 'specificDays',
    specificDays: ['Monday'],
  },
  {
    id: 'template-3',
    type: 'Zoom',
    title: 'One-on-One',
    description: 'Weekly 1:1 meeting',
    time: '14:00',
    recurringType: 'specificDays',
    specificDays: ['Wednesday'],
  },
  {
    id: 'template-4',
    type: 'Google Meet',
    title: 'Sprint Planning',
    description: 'Bi-weekly sprint planning session',
    time: '11:00',
    recurringType: 'specificDays',
    specificDays: ['Monday'],
  },
  {
    id: 'template-5',
    type: 'Microsoft Teams',
    title: 'Sprint Retrospective',
    description: 'End of sprint retrospective',
    time: '15:00',
    recurringType: 'specificDays',
    specificDays: ['Friday'],
  },
];

export const APP_VERSION = '1.0.0';
