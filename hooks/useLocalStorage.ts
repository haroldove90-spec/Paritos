// Fix: Import `React` to use its namespace for types like `React.Dispatch`.
import React, { useState, useEffect } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error("Error al analizar JSON de localStorage", error);
                return defaultValue;
            }
        }
    }
    return defaultValue;
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error al guardar en localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
}