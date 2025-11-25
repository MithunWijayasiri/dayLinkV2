'use client';

import { useState } from 'react';
import { MeetingTemplate, MeetingType, RecurringType, DAYS_OF_WEEK } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';
import { Plus, Trash2, Video, Users, MonitorPlay, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface MeetingTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  templates: MeetingTemplate[];
  onAddTemplate: (template: Omit<MeetingTemplate, 'id'>) => void;
  onDeleteTemplate: (id: string) => void;
}

const typeIcons = {
  'Google Meet': Video,
  'Microsoft Teams': Users,
  'Zoom': MonitorPlay,
  'Other': Link2,
};

export function MeetingTemplates({
  isOpen,
  onClose,
  templates,
  onAddTemplate,
  onDeleteTemplate,
}: MeetingTemplatesProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetingType>('Google Meet');
  const [time, setTime] = useState('09:00');
  const [recurringType, setRecurringType] = useState<RecurringType>('weekdays');
  const [specificDays, setSpecificDays] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    onAddTemplate({
      type,
      title: title.trim(),
      time,
      recurringType,
      specificDays: recurringType === 'specificDays' ? specificDays : undefined,
    });

    // Reset form
    setTitle('');
    setType('Google Meet');
    setTime('09:00');
    setRecurringType('weekdays');
    setSpecificDays([]);
    setShowForm(false);
    toast.success('Template created!');
  };

  const handleDayToggle = (day: string) => {
    setSpecificDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-50">Meeting Templates</DialogTitle>
        </DialogHeader>

        {!showForm ? (
          <div className="space-y-4">
            {templates.length === 0 ? (
              <EmptyState
                type="templates"
                action={
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                }
              />
            ) : (
              <>
                <div className="space-y-3">
                  {templates.map((template) => {
                    const Icon = typeIcons[template.type];
                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
                      >
                        <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-zinc-50 truncate">{template.title}</h4>
                          <p className="text-sm text-zinc-500">{template.type} • {template.time}</p>
                        </div>
                        <button
                          onClick={() => {
                            onDeleteTemplate(template.id);
                            toast.success('Template deleted');
                          }}
                          className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Template
                </Button>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Daily Standup"
                className="bg-zinc-800/50 border-zinc-700 text-zinc-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Google Meet', 'Microsoft Teams', 'Zoom', 'Other'] as MeetingType[]).map((t) => {
                  const Icon = typeIcons[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`p-3 rounded-lg border text-sm transition-all ${
                        type === t
                          ? 'bg-zinc-700 border-zinc-600 text-zinc-50'
                          : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 inline mr-2" />
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Recurrence</label>
              <div className="grid grid-cols-2 gap-2">
                {(['everyday', 'weekdays', 'weekends', 'specificDays'] as RecurringType[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRecurringType(r)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      recurringType === r
                        ? 'bg-zinc-700 border-zinc-600 text-zinc-50'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {r === 'everyday' && 'Every day'}
                    {r === 'weekdays' && 'Weekdays'}
                    {r === 'weekends' && 'Weekends'}
                    {r === 'specificDays' && 'Specific days'}
                  </button>
                ))}
              </div>
            </div>

            {recurringType === 'specificDays' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        specificDays.includes(day)
                          ? 'bg-zinc-50 text-zinc-900'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
              >
                Create Template
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
