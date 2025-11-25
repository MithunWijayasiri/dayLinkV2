import CryptoJS from 'crypto-js';

/**
 * Generate a unique phrase in XXXXX-XXXXX format
 */
export function generateUniquePhrase(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let part1 = '';
  let part2 = '';
  
  for (let i = 0; i < 5; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${part1}-${part2}`;
}

/**
 * Validate phrase format (XXXXX-XXXXX)
 */
export function validatePhraseFormat(phrase: string): boolean {
  const pattern = /^[A-Z0-9]{5}-[A-Z0-9]{5}$/;
  return pattern.test(phrase.toUpperCase());
}

/**
 * Generate a storage key from the phrase using SHA-256
 */
export function generateStorageKey(phrase: string): string {
  return CryptoJS.SHA256(phrase.toUpperCase()).toString();
}

/**
 * Encrypt data using AES-256
 */
export function encryptData(data: object, phrase: string): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, phrase.toUpperCase()).toString();
}

/**
 * Decrypt data using AES-256
 */
export function decryptData<T>(encryptedData: string, phrase: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, phrase.toUpperCase());
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      return null;
    }
    
    return JSON.parse(decryptedString) as T;
  } catch {
    return null;
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
