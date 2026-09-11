import type { Item } from './types';
import { todayISO } from './time';

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

export function generateSeedItems(): Item[] {
  const today = todayISO();
  const mk = (partial: Omit<Item, 'id' | 'date' | 'completedDates' | 'source'> & { date?: string }): Item => ({
    id: `seed-${Math.random().toString(36).slice(2, 10)}`,
    date: partial.date ?? today,
    completedDates: [],
    source: 'manual',
    ...partial,
  });

  return [
    mk({ title: 'Wake + stretch', category: 'routine', icon: '🧘', time: '06:30', durationMinutes: 15, recurrence: 'daily' }),
    mk({ title: 'Morning meds', category: 'routine', icon: '💊', time: '07:00', durationMinutes: 5, recurrence: 'daily' }),
    mk({ title: 'School drop-off', category: 'family', icon: '🚗', time: '08:00', durationMinutes: 30, recurrence: 'weekdays' }),
    mk({ title: 'Team standup', category: 'business', icon: '💻', time: '09:30', durationMinutes: 30, recurrence: 'weekdays' }),
    mk({ title: 'Investor call', category: 'business', icon: '📞', time: '11:00', durationMinutes: 45, recurrence: 'none' }),
    mk({ title: 'Lunch + walk', category: 'personal', icon: '🥗', time: '13:00', durationMinutes: 45, recurrence: 'daily' }),
    mk({ title: 'Proposal review', category: 'business', icon: '📈', time: '15:30', durationMinutes: 60, recurrence: 'weekdays' }),
    mk({ title: 'Pick up kids', category: 'family', icon: '🚗', time: '17:30', durationMinutes: 30, recurrence: 'weekdays' }),
    mk({ title: 'Family dinner', category: 'family', icon: '🍽️', time: '19:00', durationMinutes: 45, recurrence: 'daily' }),
    mk({ title: 'Read / wind down', category: 'personal', icon: '📚', time: '20:30', durationMinutes: 30, recurrence: 'daily' }),
    mk({ title: 'Sleep prep', category: 'routine', icon: '🛁', time: '22:00', durationMinutes: 20, recurrence: 'daily' }),
    mk({ title: 'Weekend family outing', category: 'family', icon: '🎉', time: '10:00', durationMinutes: 180, recurrence: 'none', date: addDays(today, 6 - new Date(`${today}T00:00:00`).getDay()) }),
    mk({ title: 'Quarterly review', category: 'business', icon: '📊', time: '14:00', durationMinutes: 90, recurrence: 'none', date: addDays(today, 4) }),
  ];
}
