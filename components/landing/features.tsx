'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Laptop, Cloud, RefreshCw, Bell } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All your data stays in your browser. No servers, no tracking, no data mining.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
  },
  {
    icon: Lock,
    title: 'AES-256 Encryption',
    description: 'Your meeting data is encrypted using military-grade encryption.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Laptop,
    title: 'Works Offline',
    description: 'Access your meetings even without an internet connection.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Cloud,
    title: 'Export & Import',
    description: 'Easily backup and restore your data across devices.',
    gradient: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: RefreshCw,
    title: 'Recurring Meetings',
    description: 'Set up daily standups, weekly syncs, and more with ease.',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get reminded before your meetings with browser notifications.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400',
  },
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
            Built for Privacy
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Every feature designed with your privacy in mind
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-zinc-50 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
