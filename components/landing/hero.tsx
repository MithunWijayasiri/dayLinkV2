'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Shield, Zap, ArrowRight } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function Hero({ onGetStarted, onLogin }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/60 border border-zinc-700/50 backdrop-blur-sm"
          >
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-zinc-300">100% Privacy-First</span>
          </motion.div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-zinc-50">Your meetings,</span>
              <br />
              <span className="bg-gradient-to-r from-zinc-50 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                your browser.
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A privacy-first meeting scheduler that runs entirely in your browser. 
              No servers, no tracking, no compromises.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="h-14 px-8 text-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 transition-all shadow-lg shadow-zinc-50/10"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={onLogin}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
            >
              I Have an Account
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-12 max-w-lg mx-auto"
          >
            {[
              { icon: Shield, label: 'Encrypted', value: 'AES-256' },
              { icon: Zap, label: 'Load Time', value: '<100ms' },
              { icon: Calendar, label: 'Servers', value: 'Zero' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-zinc-500" />
                <div className="text-xl font-semibold text-zinc-50">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
