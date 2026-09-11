import type { Category, CategoryInfo } from './types';

export const categories: Record<Category, CategoryInfo> = {
  business: { id: 'business', label: 'Business', icon: '💼', color: '#2F6FED', soft: '#E6EEFF' },
  family: { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: '#E24E7A', soft: '#FDE7EE' },
  personal: { id: 'personal', label: 'Personal', icon: '🧘', color: '#1FA37A', soft: '#E3F6EF' },
  routine: { id: 'routine', label: 'Routine', icon: '🔁', color: '#D98A1F', soft: '#FCEFDC' },
};

export const categoryOrder: Category[] = ['business', 'family', 'personal', 'routine'];

export const palette = {
  bg: '#FBF9F5',
  card: '#FFFFFF',
  border: '#ECE7DD',
  text: '#1E1B16',
  textMuted: '#736C5F',
  now: '#E24E4E',
  nowSoft: '#FDEAE9',
  disabled: '#C9C2B4',
};

export const iconChoices = [
  '💼', '📞', '💻', '📈', '🤝', '✉️',
  '👨‍👩‍👧‍👦', '🍽️', '🚗', '🎉', '🏫', '❤️',
  '🧘', '📚', '🎧', '🏃', '☕', '🛁',
  '🔁', '💊', '😴', '🥗', '🧹', '🙏',
];
