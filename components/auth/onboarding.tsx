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
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
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
                s === step ? 'w-8 bg-zinc-50' : s < step ? 'w-2 bg-zinc-50' : 'w-2 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <div className="glass-card rounded-2xl p-8 border border-zinc-800/50 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-800 mb-4">
                    <Sparkles className="w-8 h-8 text-zinc-100" />
                  </div>
                  <h1 className="text-2xl font-bold text-zinc-50">Welcome to dayLink</h1>
                  <p className="text-zinc-400">
                    Let&apos;s set up your privacy-first meeting scheduler
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <Shield className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">100% Private</p>
                      <p className="text-xs text-zinc-400">All data stays in your browser</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <Key className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Encrypted Storage</p>
                      <p className="text-xs text-zinc-400">Your data is encrypted with AES-256</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    handleGeneratePhrase();
                    setStep(2);
                  }}
                  className="w-full h-12 bg-zinc-50 text-zinc-900 hover:bg-zinc-200 transition-all"
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
                    <Key className="w-8 h-8 text-amber-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-zinc-50">Your Unique Phrase</h1>
                  <p className="text-zinc-400 text-sm">
                    This phrase is your key to access your meetings
                  </p>
                </div>

                <div className="relative">
                  <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-center font-mono text-xl tracking-widest text-zinc-50">
                    {phrase}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1 h-11 bg-zinc-800/50 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-400" />
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
                    className="flex-1 h-11 bg-zinc-800/50 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-200/80 text-center">
                    ⚠️ Save this phrase! You&apos;ll need it to recover your data.
                  </p>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  className="w-full h-12 bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
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
                  <h1 className="text-2xl font-bold text-zinc-50">Almost There!</h1>
                  <p className="text-zinc-400 text-sm">
                    Add your name (optional)
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Your Name (optional)
                    </label>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your name"
                      className="h-12 bg-zinc-800/50 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="w-full h-12 bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                >
                  {isLoading ? 'Setting up...' : 'Complete Setup'}
                  {!isLoading && <Sparkles className="w-4 h-4 ml-2" />}
                </Button>

                <button
                  onClick={() => setStep(2)}
                  className="w-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
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
