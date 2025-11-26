'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Platforms } from '@/components/landing/platforms';

import { Footer } from '@/components/shared/footer';
import { Login } from '@/components/auth/login';
import { Onboarding } from '@/components/auth/onboarding';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'landing' | 'login' | 'onboarding';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && mounted) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-background"
        >
          <Header
            onLogin={() => setView('login')}
            onGetStarted={() => setView('onboarding')}
          />
          <Hero
            onGetStarted={() => setView('onboarding')}
            onLogin={() => setView('login')}
          />
          <Platforms />
          <Features />
          <HowItWorks />

          <Footer />
        </motion.div>
      )}

      {view === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Login
            onSuccess={() => router.push('/dashboard')}
            onCreateAccount={() => setView('onboarding')}
          />
          <button
            onClick={() => setView('landing')}
            className="fixed bottom-4 left-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </motion.div>
      )}

      {view === 'onboarding' && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Onboarding onComplete={() => router.push('/dashboard')} />
          <button
            onClick={() => setView('landing')}
            className="fixed bottom-4 left-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
