import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Item } from './types';
import { generateSeedItems } from './seed';

const STORAGE_KEY = 'compass:items:v1';

interface Store {
  items: Item[];
  loading: boolean;
  addItem: (item: Omit<Item, 'id' | 'completedDates'>) => Promise<void>;
  updateItem: (id: string, patch: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleDone: (id: string, dateISO: string) => Promise<void>;
}

const StoreContext = createContext<Store | null>(null);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setItems(JSON.parse(raw));
        } else {
          const seeded = generateSeedItems();
          setItems(seeded);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next: Item[]) => {
    setItems(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<Store>(
    () => ({
      items,
      loading,
      addItem: async (item) => {
        const newItem: Item = { ...item, id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, completedDates: [] };
        await persist([...items, newItem]);
      },
      updateItem: async (id, patch) => {
        await persist(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
      },
      deleteItem: async (id) => {
        await persist(items.filter((i) => i.id !== id));
      },
      toggleDone: async (id, dateISO) => {
        await persist(
          items.map((i) => {
            if (i.id !== id) return i;
            const has = i.completedDates.includes(dateISO);
            return { ...i, completedDates: has ? i.completedDates.filter((d) => d !== dateISO) : [...i.completedDates, dateISO] };
          })
        );
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, loading]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useItems(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useItems must be used within ItemsProvider');
  return ctx;
}
