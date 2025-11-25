'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, validatePhraseFormat } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Upload, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ExportedProfile } from '@/types';

interface LoginProps {
  onSuccess: () => void;
  onCreateAccount: () => void;
}

export function Login({ onSuccess, onCreateAccount }: LoginProps) {
  const { login, importProfile } = useAuth();
  const [phrase, setPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhraseChange = (value: string) => {
    // Auto-format: uppercase and add dash after 5 characters
    let formatted = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    if (formatted.length === 5 && !formatted.includes('-') && value.length > phrase.length) {
      formatted += '-';
    }
    
    if (formatted.length <= 11) {
      setPhrase(formatted);
      setError('');
    }
  };

  const handleLogin = async () => {
    if (!validatePhraseFormat(phrase)) {
      setError('Invalid phrase format. Use XXXXX-XXXXX format.');
      return;
    }

    setIsLoading(true);
    setError('');

    const success = await login(phrase);
    
    if (success) {
      toast.success('Welcome back!');
      onSuccess();
    } else {
      setError('No account found with this phrase. Create a new one?');
    }
    
    setIsLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExportedProfile;
      
      if (!data.encryptedData || !data.version) {
        throw new Error('Invalid file format');
      }

      // Prompt for phrase
      const importPhrase = prompt('Enter your unique phrase to decrypt the backup:');
      if (!importPhrase) return;

      if (!validatePhraseFormat(importPhrase)) {
        toast.error('Invalid phrase format');
        return;
      }

      const success = await importProfile(data, importPhrase);
      
      if (success) {
        toast.success('Profile imported successfully!');
        onSuccess();
      } else {
        toast.error('Failed to decrypt. Check your phrase and try again.');
      }
    } catch {
      toast.error('Invalid backup file');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 border border-zinc-800/50 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            {!showImport ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-800 mb-4">
                    <Key className="w-8 h-8 text-zinc-100" />
                  </div>
                  <h1 className="text-2xl font-bold text-zinc-50">Welcome Back</h1>
                  <p className="text-zinc-400 text-sm">
                    Enter your unique phrase to continue
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      value={phrase}
                      onChange={(e) => handlePhraseChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder="XXXXX-XXXXX"
                      className="h-14 text-center font-mono text-xl tracking-widest bg-zinc-800/50 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                      autoFocus
                    />
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoading || phrase.length !== 11}
                  className="w-full h-12 bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900/60 px-2 text-zinc-500">or</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowImport(true)}
                    variant="outline"
                    className="flex-1 h-11 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Backup
                  </Button>
                  <Button
                    onClick={onCreateAccount}
                    variant="outline"
                    className="flex-1 h-11 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50"
                  >
                    Create New
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="import"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-zinc-50">Import Backup</h1>
                  <p className="text-zinc-400 text-sm">
                    Upload your dayLink backup file
                  </p>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-zinc-700 rounded-xl text-center cursor-pointer hover:border-zinc-500 transition-colors"
                >
                  <Upload className="w-8 h-8 mx-auto mb-3 text-zinc-500" />
                  <p className="text-sm text-zinc-400">
                    Click to select a backup file
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    .json file from dayLink export
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <button
                  onClick={() => setShowImport(false)}
                  className="w-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  ← Back to login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
