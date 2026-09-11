import type { Category, Item } from './types';
import { isBusinessWeekday, weekdayIndex, todayISO } from './time';

/** Does this item occur on the given date, accounting for recurrence? */
export function occursOn(item: Item, dateISO: string): boolean {
  if (dateISO < item.date) return false;
  switch (item.recurrence) {
    case 'none':
      return item.date === dateISO;
    case 'daily':
      return true;
    case 'weekdays':
      return isBusinessWeekday(dateISO);
    case 'weekly':
      return weekdayIndex(dateISO) === weekdayIndex(item.date);
    default:
      return false;
  }
}

export function itemsForDate(items: Item[], dateISO: string): Item[] {
  return items
    .filter((i) => occursOn(i, dateISO))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function isDoneOn(item: Item, dateISO: string): boolean {
  return item.completedDates.includes(dateISO);
}

export interface Occurrence {
  item: Item;
  date: string;
}

/** Expand items of a category into individual dated occurrences over the next `days` days. */
export function occurrencesForCategory(items: Item[], category: Category, days = 14): Occurrence[] {
  const from = todayISO();
  const out: Occurrence[] = [];
  const inCategory = items.filter((i) => i.category === category);
  for (let n = 0; n < days; n += 1) {
    const d = new Date(`${from}T00:00:00`);
    d.setDate(d.getDate() + n);
    const iso = d.toISOString().slice(0, 10);
    for (const item of inCategory) {
      if (occursOn(item, iso)) out.push({ item, date: iso });
    }
  }
  return out.sort((a, b) => (a.date === b.date ? a.item.time.localeCompare(b.item.time) : a.date.localeCompare(b.date)));
}

/** The next upcoming date (today or later) this item occurs on. */
export function nextOccurrence(item: Item, fromISO: string): string | null {
  if (item.recurrence === 'none') {
    return item.date >= fromISO ? item.date : null;
  }
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(`${fromISO}T00:00:00`);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    if (occursOn(item, iso)) return iso;
  }
  return null;
}
