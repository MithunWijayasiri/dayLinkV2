'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/lib/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const item = getStorageItem<T>(key);
    if (item !== null) {
      setStoredValue(item);
    }
    setIsLoading(false);
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setStorageItem(key, valueToStore);
  }, [key, storedValue]);

  return [storedValue, setValue, isLoading] as const;
}
