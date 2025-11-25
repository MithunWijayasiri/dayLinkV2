'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, AuthContextType, ExportedProfile } from '@/types';
import {
  generateUniquePhrase,
  validatePhraseFormat,
  encryptData,
  decryptData,
} from '@/lib/encryption';
import {
  saveUserProfile,
  loadUserProfile,
  deleteUserProfile,
  profileExists,
  getSessionPhrase,
  setSessionPhrase,
  clearSession,
} from '@/lib/storage';
import { DEFAULT_TEMPLATES, APP_VERSION } from '@/constants/templates';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const sessionPhrase = getSessionPhrase();
    if (sessionPhrase) {
      const loadedProfile = loadUserProfile(sessionPhrase);
      if (loadedProfile) {
        setProfile(loadedProfile);
        setCurrentPhrase(sessionPhrase);
        setIsAuthenticated(true);
      } else {
        clearSession();
      }
    }
    setIsLoading(false);
  }, []);

  // Save profile whenever it changes
  useEffect(() => {
    if (profile && currentPhrase) {
      saveUserProfile(profile, currentPhrase);
    }
  }, [profile, currentPhrase]);

  const login = useCallback(async (phrase: string): Promise<boolean> => {
    if (!validatePhraseFormat(phrase)) {
      return false;
    }

    const loadedProfile = loadUserProfile(phrase);
    if (!loadedProfile) {
      return false;
    }

    setProfile(loadedProfile);
    setCurrentPhrase(phrase.toUpperCase());
    setSessionPhrase(phrase.toUpperCase());
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setProfile(null);
    setCurrentPhrase(null);
    setIsAuthenticated(false);
    clearSession();
  }, []);

  const register = useCallback(async (phrase: string, username?: string) => {
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      uniquePhrase: phrase.toUpperCase(),
      username,
      meetings: [],
      templates: DEFAULT_TEMPLATES,
      preferences: {
        theme: 'dark',
        notifications: {
          enabled: true,
          before15Min: true,
          before5Min: true,
          atTime: true,
        },
      },
      createdAt: now,
      updatedAt: now,
    };

    saveUserProfile(newProfile, phrase);
    setProfile(newProfile);
    setCurrentPhrase(phrase.toUpperCase());
    setSessionPhrase(phrase.toUpperCase());
    setIsAuthenticated(true);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const importProfile = useCallback(async (data: ExportedProfile, phrase: string): Promise<boolean> => {
    try {
      const decrypted = decryptData<UserProfile>(data.encryptedData, phrase);
      if (!decrypted) {
        return false;
      }

      // Merge with defaults in case of missing fields
      const importedProfile: UserProfile = {
        ...decrypted,
        uniquePhrase: phrase.toUpperCase(),
        updatedAt: new Date().toISOString(),
      };

      saveUserProfile(importedProfile, phrase);
      setProfile(importedProfile);
      setCurrentPhrase(phrase.toUpperCase());
      setSessionPhrase(phrase.toUpperCase());
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const exportProfile = useCallback((): ExportedProfile | null => {
    if (!profile || !currentPhrase) return null;

    return {
      version: APP_VERSION,
      exportDate: new Date().toISOString(),
      username: profile.username,
      encryptedData: encryptData(profile, currentPhrase),
    };
  }, [profile, currentPhrase]);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profile,
        login,
        logout,
        register,
        updateProfile,
        importProfile,
        exportProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { generateUniquePhrase, validatePhraseFormat };
