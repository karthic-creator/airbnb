import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItems } from '@/store';
import { occurrencesForCategory } from '@/agenda';
import { categories, palette } from '@/theme';
import { todayISO } from '@/time';
import { ItemRow } from '@/components/ItemRow';
import type { Category } from '@/types';

function dayLabel(iso: string, todayIso: string): string {
  if (iso === todayIso) return 'Today';
  const tomorrow = new Date(`${todayIso}T00:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (iso === tomorrow.toISOString().slice(0, 10)) return 'Tomorrow';
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function CategoryBoardScreen() {
  const { category } = useLocalSearchParams<{ category: Category }>();
  const { items } = useItems();
  const cat = categories[category];
  const todayIso = todayISO();

  const occurrences = useMemo(() => occurrencesForCategory(items, category, 14), [items, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof occurrences>();
    for (const occ of occurrences) {
      const list = map.get(occ.date) ?? [];
      list.push(occ);
      map.set(occ.date, list);
    }
    return Array.from(map.entries());
  }, [occurrences]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: true, title: `${cat.icon} ${cat.label}`, headerStyle: { backgroundColor: cat.soft } }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {grouped.length === 0 ? (
          <Text style={styles.muted}>Nothing planned for {cat.label} yet. Tap + on any tab to add one.</Text>
        ) : (
          grouped.map(([date, occs]) => (
            <View key={date} style={styles.group}>
              <Text style={styles.groupTitle}>{dayLabel(date, todayIso)}</Text>
              {occs.map(({ item, date: d }) => (
                <ItemRow key={`${item.id}-${d}`} item={item} dateISO={d} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: 20, paddingBottom: 60 },
  group: { marginBottom: 18 },
  groupTitle: { fontSize: 14, fontWeight: '800', color: palette.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  muted: { color: palette.textMuted, fontSize: 15, marginTop: 20 },
});
