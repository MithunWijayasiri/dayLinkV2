'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, generateUniquePhrase } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Download, ArrowRight, Sparkles, Shield, Key } from 'lucide-react';
import toast from 'react-hot-toast';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [phrase, setPhrase] = useState('');
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePhrase = () => {
    const newPhrase = generateUniquePhrase();
    setPhrase(newPhrase);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(phrase);
    setCopied(true);
    toast.success('Phrase copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `dayLink Recovery Phrase\n\nYour unique phrase: ${phrase}\n\nIMPORTANT: Keep this phrase safe! You'll need it to access your meetings on other devices or if you clear your browser data.\n\nGenerated on: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daylink-recovery-phrase.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Recovery phrase downloaded!');
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await register(phrase, username || undefined);
      toast.success('Welcome to dayLink!');
      onComplete();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-foreground' : s < step ? 'w-2 bg-foreground' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="glass-card rounded-2xl p-8 border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 mb-4">
                    <Sparkles className="w-8 h-8 text-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Welcome to dayLink</h1>
                  <p className="text-muted-foreground">
                    Let&apos;s set up your privacy-first meeting scheduler
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <Shield className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">100% Private</p>
                      <p className="text-xs text-muted-foreground">All data stays in your browser</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <Key className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Encrypted Storage</p>
                      <p className="text-xs text-muted-foreground">Your data is encrypted with AES-256</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    handleGeneratePhrase();
                    setStep(2);
                  }}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4">
                    <Key className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Your Unique Phrase</h1>
                  <p className="text-muted-foreground text-sm">
                    This phrase is your key to access your meetings
                  </p>
                </div>

                <div className="relative">
                  <div className="p-4 rounded-xl bg-muted border border-border text-center font-mono text-xl tracking-widest text-foreground">
                    {phrase}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1 h-11 bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 h-11 bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-700 dark:text-amber-200/80 text-center">
                    ⚠️ Save this phrase! You&apos;ll need it to recover your data.
                  </p>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90"
                >
                  I&apos;ve Saved My Phrase
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">Almost There!</h1>
                  <p className="text-muted-foreground text-sm">
                    Add your name (optional)
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Your Name (optional)
                    </label>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your name"
                      className="h-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90"
                >
                  {isLoading ? 'Setting up...' : 'Complete Setup'}
                  {!isLoading && <Sparkles className="w-4 h-4 ml-2" />}
                </Button>

                <button
                  onClick={() => setStep(2)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Go back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
