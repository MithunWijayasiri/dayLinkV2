'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meeting, MeetingType, RecurringType, DAYS_OF_WEEK, MeetingTemplate } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Video, Users, MonitorPlay, Link2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface MeetingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editMeeting?: Meeting | null;
  templates?: MeetingTemplate[];
}

const meetingTypes: { type: MeetingType; icon: any; color: string }[] = [
  { type: 'Google Meet', icon: Video, color: 'bg-green-500/20 border-green-500/30 text-green-400' },
  { type: 'Microsoft Teams', icon: Users, color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
  { type: 'Zoom', icon: MonitorPlay, color: 'bg-sky-500/20 border-sky-500/30 text-sky-400' },
  { type: 'Other', icon: Link2, color: 'bg-zinc-500/20 border-zinc-500/30 text-zinc-400' },
];

const recurringOptions: { type: RecurringType; label: string }[] = [
  { type: 'everyday', label: 'Every day' },
  { type: 'weekdays', label: 'Weekdays (Mon-Fri)' },
  { type: 'weekends', label: 'Weekends (Sat-Sun)' },
  { type: 'specificDays', label: 'Specific days' },
  { type: 'specific', label: 'Specific dates' },
];

export function MeetingForm({ isOpen, onClose, onSave, editMeeting, templates = [] }: MeetingFormProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<MeetingType>('Google Meet');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('09:00');
  const [recurringType, setRecurringType] = useState<RecurringType>('weekdays');
  const [specificDays, setSpecificDays] = useState<string[]>([]);
  const [specificDates, setSpecificDates] = useState<Date[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editMeeting) {
        setSelectedType(editMeeting.type);
        setTitle(editMeeting.title);
        setLink(editMeeting.link);
        setDescription(editMeeting.description || '');
        setTime(editMeeting.time);
        setRecurringType(editMeeting.recurringType);
        setSpecificDays(editMeeting.specificDays || []);
        setSpecificDates(editMeeting.specificDates?.map(d => new Date(d)) || []);
        setStep(1);
      } else {
        setSelectedType('Google Meet');
        setTitle('');
        setLink('');
        setDescription('');
        setTime('09:00');
        setRecurringType('weekdays');
        setSpecificDays([]);
        setSpecificDates([]);
        setStep(1);
        setSelectedTemplate(null);
      }
    }
  }, [isOpen, editMeeting]);

  const handleTemplateSelect = (template: MeetingTemplate) => {
    setSelectedType(template.type);
    setTitle(template.title);
    setDescription(template.description || '');
    setTime(template.time);
    setRecurringType(template.recurringType);
    setSpecificDays(template.specificDays || []);
    setSelectedTemplate(template.id);
    setStep(2);
  };

  const handleDayToggle = (day: string) => {
    setSpecificDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!link.trim()) {
      toast.error('Please enter a meeting link');
      return;
    }
    if (recurringType === 'specificDays' && specificDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }
    if (recurringType === 'specific' && specificDates.length === 0) {
      toast.error('Please select at least one date');
      return;
    }

    onSave({
      type: selectedType,
      title: title.trim(),
      link: link.trim(),
      description: description.trim() || undefined,
      time,
      recurringType,
      specificDays: recurringType === 'specificDays' ? specificDays : undefined,
      specificDates: recurringType === 'specific' ? specificDates.map(d => d.toISOString().split('T')[0]) : undefined,
    });

    toast.success(editMeeting ? 'Meeting updated!' : 'Meeting added!');
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) return title.trim() && link.trim();
    if (step === 3) {
      if (recurringType === 'specificDays') return specificDays.length > 0;
      if (recurringType === 'specific') return specificDates.length > 0;
      return true;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            {editMeeting ? 'Edit Meeting' : 'Add Meeting'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${
                s <= step ? 'bg-foreground' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">Choose meeting type:</p>

              <div className="grid grid-cols-2 gap-3">
                {meetingTypes.map(({ type, icon: Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedType === type
                        ? color + ' ring-1 ring-offset-2 ring-offset-background'
                        : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{type}</span>
                  </button>
                ))}
              </div>

              {templates.length > 0 && !editMeeting && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Or use a template:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          selectedTemplate === template.id
                            ? 'bg-muted border-border'
                            : 'bg-muted/50 border-border hover:bg-muted'
                        }`}
                      >
                        <p className="text-sm font-medium text-foreground">{template.title}</p>
                        <p className="text-xs text-muted-foreground">{template.type} • {template.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Meeting Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Daily Standup"
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Meeting Link *
                </label>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Description (optional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Time
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Recurrence
                </label>
                <div className="space-y-2">
                  {recurringOptions.map(({ type, label }) => (
                    <button
                      key={type}
                      onClick={() => setRecurringType(type)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        recurringType === type
                          ? 'bg-muted border-border'
                          : 'bg-muted/50 border-border hover:bg-muted'
                      }`}
                    >
                      <span className="text-sm text-foreground">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {recurringType === 'specificDays' && (
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Select Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          specificDays.includes(day)
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {recurringType === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Select Dates
                  </label>
                  <Calendar
                    mode="multiple"
                    selected={specificDates}
                    onSelect={(dates) => setSpecificDates(dates || [])}
                    className="rounded-lg border border-border bg-muted"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t border-border">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="bg-muted/50 border-border text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Check className="w-4 h-4 mr-2" />
              {editMeeting ? 'Save Changes' : 'Add Meeting'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
