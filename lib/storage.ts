import { UserProfile } from '@/types';
import { generateStorageKey, encryptData, decryptData } from './encryption';

const STORAGE_PREFIX = 'daylink_';

/**
 * Get item from localStorage with type safety
 */
export function getStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

/**
 * Set item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

/**
 * Save encrypted user profile
 */
export function saveUserProfile(profile: UserProfile, phrase: string): void {
  const storageKey = `${STORAGE_PREFIX}${generateStorageKey(phrase)}`;
  const encryptedData = encryptData(profile, phrase);
  setStorageItem(storageKey, { encrypted: encryptedData });
}

/**
 * Load encrypted user profile
 */
export function loadUserProfile(phrase: string): UserProfile | null {
  const storageKey = `${STORAGE_PREFIX}${generateStorageKey(phrase)}`;
  const stored = getStorageItem<{ encrypted: string }>(storageKey);
  
  if (!stored) return null;
  
  return decryptData<UserProfile>(stored.encrypted, phrase);
}

/**
 * Delete user profile
 */
export function deleteUserProfile(phrase: string): void {
  const storageKey = `${STORAGE_PREFIX}${generateStorageKey(phrase)}`;
  removeStorageItem(storageKey);
}

/**
 * Check if profile exists for a phrase
 */
export function profileExists(phrase: string): boolean {
  const storageKey = `${STORAGE_PREFIX}${generateStorageKey(phrase)}`;
  return getStorageItem(storageKey) !== null;
}

/**
 * Get theme preference
 */
export function getThemePreference(): 'dark' | 'light' | 'system' {
  return getStorageItem<'dark' | 'light' | 'system'>('daylink_theme') || 'dark';
}

/**
 * Set theme preference
 */
export function setThemePreference(theme: 'dark' | 'light' | 'system'): void {
  setStorageItem('daylink_theme', theme);
}

/**
 * Get current session phrase (for auto-login)
 */
export function getSessionPhrase(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('daylink_session');
}

/**
 * Set current session phrase
 */
export function setSessionPhrase(phrase: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('daylink_session', phrase);
}

/**
 * Clear session
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('daylink_session');
}
