'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTAProps {
  onGetStarted: () => void;
}

export function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted via-card to-background border border-border/50 p-12 text-center"
        >
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-muted-foreground/10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 mb-6">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-sm text-muted-foreground">Free Forever</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to take control of your meetings?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands who trust dayLink for their daily meeting management.
              No sign-up required, no data collected.
            </p>
            
            <Button
              onClick={onGetStarted}
              size="lg"
              className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg"
            >
              Start Using dayLink
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
