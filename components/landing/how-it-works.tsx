'use client';

import { motion } from 'framer-motion';
import { Key, Calendar, Bell } from 'lucide-react';

const steps = [
  {
    icon: Key,
    step: '01',
    title: 'Get Your Unique Phrase',
    description: 'Generate a unique phrase that acts as your key. No email or password needed.',
  },
  {
    icon: Calendar,
    step: '02',
    title: 'Add Your Meetings',
    description: 'Add your Google Meet, Teams, Zoom, or custom meeting links.',
  },
  {
    icon: Bell,
    step: '03',
    title: 'Never Miss a Meeting',
    description: 'Get notified before each meeting and join with one click.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in under a minute
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">{item.step}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
