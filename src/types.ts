export type Category = 'business' | 'family' | 'personal' | 'routine';

export type Recurrence = 'none' | 'daily' | 'weekdays' | 'weekly';

export type ItemSource = 'manual' | 'google_calendar' | 'whatsapp' | 'phone_call' | 'wearable' | 'email_digest';

export interface Item {
  id: string;
  title: string;
  category: Category;
  icon: string;
  /** ISO date, e.g. 2026-09-11 — the calendar day this instance lives on */
  date: string;
  /** 24h "HH:mm" */
  time: string;
  durationMinutes: number;
  recurrence: Recurrence;
  /** ISO dates on which this item (including recurring instances) was marked done */
  completedDates: string[];
  source: ItemSource;
  notes?: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  color: string;
  soft: string;
}
