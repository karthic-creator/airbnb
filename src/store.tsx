import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Item } from './types';
import { generateSeedItems } from './seed';
import { fetchEmailDigests, fetchMeetingNotes } from './sync';
import type { ItemSource } from './types';

const SYNCED_SOURCES: ItemSource[] = ['email_digest', 'meeting_notes'];

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
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      let current: Item[];
      if (raw) {
        current = JSON.parse(raw);
      } else {
        current = generateSeedItems();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      }
      setItems(current);
      setLoading(false);

      // Best-effort: refresh synced items (email digests, meeting notes)
      // from source on every load (not just add new ones) so a routine or
      // format change is reflected without requiring a local data reset —
      // but carry over completedDates so toggling one off isn't undone.
      const [digests, meetingNotes] = await Promise.all([fetchEmailDigests(), fetchMeetingNotes()]);
      const synced = [...digests, ...meetingNotes];
      if (synced.length > 0) {
        const existingById = new Map(current.map((i) => [i.id, i]));
        const freshSynced = synced.map((d) => ({
          ...d,
          completedDates: existingById.get(d.id)?.completedDates ?? d.completedDates,
        }));
        const unsyncedItems = current.filter((i) => !SYNCED_SOURCES.includes(i.source));
        const merged = [...unsyncedItems, ...freshSynced];
        setItems(merged);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
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
